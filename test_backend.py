import sys
import os
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.main import app

def run_tests():
    print("=== Testing Upgraded Real Estate SaaS (LLM, 5-Cities, White-Label, Digest) ===")
    client = TestClient(app)

    # 1. Health check
    res = client.get("/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    print(" [1/9] Health check passed.")

    # 2. Universal Cities Registry
    res_cities = client.get("/cities")
    assert res_cities.status_code == 200
    cities_list = res_cities.json()["cities"]
    city_ids = [c["id"] for c in cities_list]
    assert "pune" in city_ids and "lucknow" in city_ids and "mumbai" in city_ids and "bengaluru" in city_ids and "delhi_ncr" in city_ids
    print(f" [2/9] Universal 5-City Registry verified: {city_ids}")

    # 3. User usage check (mock user fallback)
    res = client.get("/user/usage", headers={"X-Mock-User-Id": "test-user-id"})
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    usage = res.json()
    assert usage["plan_tier"] == "pro"
    print(" [3/9] User usage endpoint passed:", usage["plan_tier"], usage["cities_subscribed"])

    # 4. Generate report for Pune
    print(" [4/9] Generating Pune report...")
    res = client.post("/reports/generate?city=pune", headers={"X-Mock-User-Id": "test-user-id"})
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    report_pune = res.json()
    assert report_pune["status"] == "success"
    print(" [4/9] Pune generation passed. Source:", report_pune["source"])

    # 5. Test City Gating Security & Update Subscribed Cities (Pro tier max 3 cities)
    print(" [5/9] Testing City Gating & Adding Mumbai to Pro tier subscription...")
    res_block = client.post("/reports/generate?city=mumbai", headers={"X-Mock-User-Id": "test-user-id"})
    assert res_block.status_code == 403, "Unsubscribed city should be blocked with 403 Forbidden"
    print(" [5/9] Unsubscribed city properly blocked by tier security policy.")

    res_add_city = client.post(
        "/user/cities",
        json={"cities": ["pune", "lucknow", "mumbai"]},
        headers={"X-Mock-User-Id": "test-user-id"}
    )
    assert res_add_city.status_code == 200
    assert "mumbai" in res_add_city.json()["cities_subscribed"]
    print(" [5/9] Subscribed cities updated to include Mumbai.")

    # 6. Generate report for Mumbai (New Universal City + Dynamic Engine)
    print(" [6/9] Generating Mumbai (MMR) report...")
    res_mumbai = client.post("/reports/generate?city=mumbai", headers={"X-Mock-User-Id": "test-user-id"})
    assert res_mumbai.status_code == 200, f"Expected 200, got {res_mumbai.status_code}: {res_mumbai.text}"
    report_mumbai = res_mumbai.json()
    assert report_mumbai["status"] == "success"
    assert "Mumbai" in report_mumbai["content"]
    print(" [6/9] Mumbai generation passed. Source:", report_mumbai["source"])

    # 7. Test White-Label PDF Branding
    print(" [7/9] Testing White-Label Branding save...")
    branding_payload = {
        "agency_name": "Apex Premier Realty Advisors",
        "agency_phone": "+91 99887 76655",
        "agency_rera_id": "MahaRERA A52100099887",
        "agency_logo_url": "https://example.com/logo.png"
    }
    res_brand = client.post("/user/branding", json=branding_payload, headers={"X-Mock-User-Id": "test-user-id"})
    assert res_brand.status_code == 200
    assert res_brand.json()["branding"]["agency_name"] == "Apex Premier Realty Advisors"
    print(" [7/9] White-label branding preferences saved successfully.")

    # 8. Test Immediate Morning Email Digest Delivery
    print(" [8/9] Testing Morning Email Digest dispatch...")
    res_digest = client.post("/user/test-digest", headers={"X-Mock-User-Id": "test-user-id"})
    assert res_digest.status_code == 200
    digest_data = res_digest.json()
    assert "email" in digest_data
    print(f" [8/9] Email digest verified for {digest_data['email']} covering {digest_data['cities_covered']}.")

    # 9. Test Stripe checkout session creation
    res_stripe = client.post(
        "/billing/create-checkout-session",
        json={"plan_tier": "agency"},
        headers={"X-Mock-User-Id": "test-user-id"}
    )
    assert res_stripe.status_code == 200
    stripe_session = res_stripe.json()
    assert "checkout_url" in stripe_session
    print(" [9/9] Stripe Agency Tier checkout session verified:", stripe_session.get("session_id"))

    print("\n All 9 Upgraded SaaS tests passed successfully!")

if __name__ == "__main__":
    run_tests()
