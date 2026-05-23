import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


CATEGORIES = [
    "Product Launch",
    "Model Release",
    "Pricing Change",
    "Funding News",
    "Partnership",
    "Hiring Signal",
    "Documentation Update",
    "Research Update",
    "Market Expansion",
    "Other"
]


def local_summary_fallback(title: str, content: str):
    """
    Free local fallback summary.
    Used when OpenAI API key/quota is unavailable.
    """

    if not content:
        content = title

    return (
        f"{title}. "
        f"This competitor update indicates a relevant change that should be tracked by the intelligence system. "
        f"It may affect product strategy, market positioning, pricing, or customer adoption depending on the update context."
    )


def summarize_with_openai(title: str, content: str):
    """
    OpenAI-based summarization.
    Currently not used directly because API quota is unavailable.
    Keep this function for future use when billing/quota is available.
    """

    client = OpenAI(api_key=OPENAI_API_KEY)

    if not content:
        content = title

    prompt = f"""
You are a competitive intelligence analyst.

Summarize the following competitor update in 3 to 4 clear lines.

Focus on:
1. What changed
2. Why it matters
3. Which market, users, or competitors may be affected

Title:
{title}

Content:
{content}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an expert competitive intelligence analyst."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        max_tokens=180
    )

    return response.choices[0].message.content.strip()


def summarize_competitor_update(title: str, content: str):
    """
    Uses local fallback summary directly.
    OpenAI is temporarily disabled because API quota is unavailable.
    """

    return local_summary_fallback(title, content)


def local_analysis_fallback(title: str, content: str, summary: str = None):
    """
    Free rule-based category and threat score analyzer.
    This avoids API quota issues.
    """

    text = f"{title} {content or ''} {summary or ''}".lower()

    category = "Other"
    threat_score = 4
    threat_reason = "This update is relevant but does not strongly indicate a major competitive threat."

    if any(word in text for word in ["model", "gpt", "claude", "llm", "ai model", "reasoning"]):
        category = "Model Release"
        threat_score = 8
        threat_reason = (
            "This appears to be related to model capability improvements, which can directly affect AI product competition, "
            "developer adoption, and enterprise usage."
        )

    elif any(word in text for word in ["price", "pricing", "cost", "subscription", "plan", "pro"]):
        category = "Pricing Change"
        threat_score = 7
        threat_reason = (
            "Pricing changes can influence customer switching, adoption speed, and competitive positioning in the market."
        )

    elif any(word in text for word in ["launch", "released", "introducing", "new product", "feature"]):
        category = "Product Launch"
        threat_score = 7
        threat_reason = (
            "A new product or feature launch may improve the competitor's market position and attract new users."
        )

    elif any(word in text for word in ["funding", "raised", "investment", "series"]):
        category = "Funding News"
        threat_score = 6
        threat_reason = (
            "Funding can help the competitor expand faster, hire talent, and invest in product development."
        )

    elif any(word in text for word in ["partner", "partnership", "collaboration", "integrates"]):
        category = "Partnership"
        threat_score = 6
        threat_reason = (
            "Partnerships can expand distribution, improve integrations, and strengthen the competitor ecosystem."
        )

    elif any(word in text for word in ["hiring", "jobs", "career", "engineer", "researcher"]):
        category = "Hiring Signal"
        threat_score = 5
        threat_reason = (
            "Hiring signals may indicate expansion into new product areas or increased investment in technical capabilities."
        )

    elif any(word in text for word in ["docs", "documentation", "api docs", "guide", "developer"]):
        category = "Documentation Update"
        threat_score = 4
        threat_reason = (
            "Documentation updates can improve developer experience but may not always indicate a major strategic move."
        )

    elif any(word in text for word in ["research", "paper", "benchmark", "study"]):
        category = "Research Update"
        threat_score = 6
        threat_reason = (
            "Research updates can indicate future technical direction and possible upcoming product improvements."
        )

    elif any(word in text for word in ["india", "europe", "global", "market", "expansion", "region"]):
        category = "Market Expansion"
        threat_score = 7
        threat_reason = (
            "Market expansion can increase customer reach and strengthen the competitor's presence in new regions."
        )

    return {
        "category": category,
        "threat_score": threat_score,
        "threat_reason": threat_reason
    }


def analyze_with_openai(title: str, content: str, summary: str = None):
    """
    OpenAI-based category and threat analysis.
    Currently not used directly because API quota is unavailable.
    Keep this function for future use when billing/quota is available.
    """

    client = OpenAI(api_key=OPENAI_API_KEY)

    if not content:
        content = title

    prompt = f"""
You are a competitive intelligence analyst.

Analyze the competitor update below.

Return ONLY valid JSON in this format:
{{
  "category": "one category from the allowed list",
  "threat_score": number from 1 to 10,
  "threat_reason": "clear reason in 2 to 3 lines"
}}

Allowed categories:
Product Launch, Model Release, Pricing Change, Funding News, Partnership, Hiring Signal, Documentation Update, Research Update, Market Expansion, Other

Scoring guide:
1-3 = Low threat
4-6 = Medium threat
7-10 = High threat

Title:
{title}

Summary:
{summary}

Content:
{content}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an expert competitive intelligence analyst. Return only valid JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=220
    )

    result_text = response.choices[0].message.content.strip()

    return json.loads(result_text)


def analyze_competitor_update(title: str, content: str, summary: str = None):
    """
    Uses local rule-based analysis directly.
    OpenAI is temporarily disabled because API quota is unavailable.
    """

    return local_analysis_fallback(title, content, summary)
def local_prediction_fallback(
    title: str,
    content: str,
    summary: str = None,
    category: str = None,
    threat_score: int = None,
    similar_updates: list = None
):
    """
    Free local prediction generator.
    This does not call OpenAI API.
    It generates rule-based competitor next-move predictions.
    """

    text = f"{title} {content or ''} {summary or ''} {category or ''}".lower()

    similar_updates = similar_updates or []

    confidence_level = "Medium"

    if threat_score is None:
        threat_score = 4

    if threat_score >= 8:
        confidence_level = "High"
    elif threat_score <= 3:
        confidence_level = "Low"

    prediction = (
        "The competitor may continue making incremental updates in this area. "
        "This movement should be monitored for future product, pricing, or market positioning changes."
    )

    recommended_response = (
        "Continue monitoring this competitor and compare future updates with historical movement patterns."
    )

    if category == "Model Release" or any(word in text for word in ["model", "gpt", "claude", "llm", "reasoning"]):
        prediction = (
            "The competitor may next focus on improving model capabilities, developer APIs, coding performance, "
            "enterprise integrations, or lower-latency AI features."
        )
        recommended_response = (
            "Track upcoming model benchmarks, API changes, pricing updates, and enterprise adoption signals. "
            "Compare their model capabilities with other AI platforms."
        )

    elif category == "Pricing Change" or any(word in text for word in ["price", "pricing", "cost", "subscription", "plan"]):
        prediction = (
            "The competitor may adjust pricing tiers, introduce cheaper plans, bundle features, "
            "or target price-sensitive developers and businesses."
        )
        recommended_response = (
            "Monitor pricing pages frequently and compare value differences across competitors. "
            "Prepare a pricing comparison section in the dashboard."
        )

    elif category == "Product Launch" or any(word in text for word in ["launch", "released", "introducing", "feature"]):
        prediction = (
            "The competitor may expand this launch with more features, integrations, user onboarding campaigns, "
            "or enterprise-focused upgrades."
        )
        recommended_response = (
            "Track user reactions, product documentation, and follow-up releases to understand adoption direction."
        )

    elif category == "Partnership" or any(word in text for word in ["partner", "partnership", "collaboration", "integrates"]):
        prediction = (
            "The competitor may use this partnership to expand distribution, improve ecosystem integrations, "
            "or enter a new customer segment."
        )
        recommended_response = (
            "Watch partner announcements, integration docs, and customer case studies related to this partnership."
        )

    elif category == "Funding News" or any(word in text for word in ["funding", "raised", "investment", "series"]):
        prediction = (
            "The competitor may increase hiring, accelerate product development, expand infrastructure, "
            "or enter new markets using the new funding."
        )
        recommended_response = (
            "Monitor hiring pages, leadership announcements, product roadmap hints, and infrastructure investments."
        )

    elif category == "Hiring Signal" or any(word in text for word in ["hiring", "jobs", "career", "engineer", "researcher"]):
        prediction = (
            "The competitor may be preparing a new product area, technical capability, research direction, "
            "or regional expansion based on hiring patterns."
        )
        recommended_response = (
            "Track job descriptions, required skills, team locations, and repeated hiring patterns."
        )

    elif category == "Documentation Update" or any(word in text for word in ["docs", "documentation", "api docs", "guide"]):
        prediction = (
            "The competitor may be improving developer experience, preparing for API adoption, "
            "or supporting a recently launched feature."
        )
        recommended_response = (
            "Monitor documentation changes, SDK updates, API examples, and developer community response."
        )

    elif category == "Research Update" or any(word in text for word in ["research", "paper", "benchmark", "study"]):
        prediction = (
            "The competitor may convert this research direction into future model improvements, product features, "
            "or technical differentiation."
        )
        recommended_response = (
            "Track whether this research appears later in product releases, benchmarks, or technical blogs."
        )

    elif category == "Market Expansion" or any(word in text for word in ["india", "europe", "global", "expansion", "region"]):
        prediction = (
            "The competitor may expand sales, partnerships, hiring, or localized product offerings in the new market."
        )
        recommended_response = (
            "Monitor regional announcements, local partnerships, job openings, pricing localization, and customer adoption."
        )

    if len(similar_updates) >= 2:
        prediction += (
            " Similar historical updates suggest this may be part of a repeated strategic pattern rather than an isolated move."
        )

    return {
        "prediction": prediction,
        "confidence_level": confidence_level,
        "recommended_response": recommended_response
    }


def predict_competitor_next_move(
    title: str,
    content: str,
    summary: str = None,
    category: str = None,
    threat_score: int = None,
    similar_updates: list = None
):
    """
    Generates competitor next-move prediction.
    Currently uses local fallback because OpenAI API quota is unavailable.
    """

    return local_prediction_fallback(
        title=title,
        content=content,
        summary=summary,
        category=category,
        threat_score=threat_score,
        similar_updates=similar_updates
    )