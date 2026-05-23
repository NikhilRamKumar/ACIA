from app.database.db import SessionLocal
from app.models.competitor import Competitor
from app.models.update import CompetitorUpdate


DOMAIN_COMPETITORS = [
    # ---------------- AI / GenAI ----------------
    {
        "name": "OpenAI",
        "website_url": "https://openai.com",
        "blog_url": "https://openai.com/news",
        "pricing_url": "https://openai.com/api/pricing",
        "docs_url": "https://platform.openai.com/docs",
        "github_url": "https://github.com/openai",
        "industry": "Artificial Intelligence",
        "description": "AI company behind ChatGPT, GPT models, and developer APIs.",
        "domain": "ai_genai",
    },
    {
        "name": "Anthropic",
        "website_url": "https://www.anthropic.com",
        "blog_url": "https://www.anthropic.com/news",
        "pricing_url": "https://www.anthropic.com/pricing",
        "docs_url": "https://docs.anthropic.com",
        "github_url": "https://github.com/anthropics",
        "industry": "Artificial Intelligence",
        "description": "AI safety company behind Claude models and enterprise AI assistants.",
        "domain": "ai_genai",
    },
    {
        "name": "Perplexity",
        "website_url": "https://www.perplexity.ai",
        "blog_url": "https://www.perplexity.ai/hub/blog",
        "pricing_url": "https://www.perplexity.ai/pro",
        "docs_url": "https://docs.perplexity.ai",
        "github_url": "https://github.com/perplexityai",
        "industry": "AI Search",
        "description": "AI-powered search and answer engine.",
        "domain": "ai_genai",
    },
    {
        "name": "Google Gemini",
        "website_url": "https://gemini.google.com",
        "blog_url": "https://blog.google/technology/ai/",
        "pricing_url": "https://ai.google.dev/pricing",
        "docs_url": "https://ai.google.dev/gemini-api/docs",
        "github_url": "https://github.com/google-gemini",
        "industry": "Artificial Intelligence",
        "description": "Google AI ecosystem including Gemini models and AI developer APIs.",
        "domain": "ai_genai",
    },
    {
        "name": "Mistral AI",
        "website_url": "https://mistral.ai",
        "blog_url": "https://mistral.ai/news",
        "pricing_url": "https://mistral.ai/pricing",
        "docs_url": "https://docs.mistral.ai",
        "github_url": "https://github.com/mistralai",
        "industry": "Artificial Intelligence",
        "description": "AI company building open and commercial language models.",
        "domain": "ai_genai",
    },
    {
        "name": "Cohere",
        "website_url": "https://cohere.com",
        "blog_url": "https://cohere.com/blog",
        "pricing_url": "https://cohere.com/pricing",
        "docs_url": "https://docs.cohere.com",
        "github_url": "https://github.com/cohere-ai",
        "industry": "Enterprise AI",
        "description": "Enterprise AI platform for language models, embeddings, and reranking.",
        "domain": "ai_genai",
    },
    {
        "name": "Meta AI",
        "website_url": "https://ai.meta.com",
        "blog_url": "https://ai.meta.com/blog",
        "pricing_url": "https://ai.meta.com",
        "docs_url": "https://llama.meta.com/docs",
        "github_url": "https://github.com/meta-llama",
        "industry": "Artificial Intelligence",
        "description": "Meta AI ecosystem including Llama models and AI assistant experiences.",
        "domain": "ai_genai",
    },
    {
        "name": "xAI",
        "website_url": "https://x.ai",
        "blog_url": "https://x.ai/news",
        "pricing_url": "https://docs.x.ai/developers/pricing",
        "docs_url": "https://docs.x.ai",
        "github_url": "https://github.com/xai-org",
        "industry": "Artificial Intelligence",
        "description": "AI company behind Grok models and xAI developer APIs.",
        "domain": "ai_genai",
    },
    {
        "name": "Hugging Face",
        "website_url": "https://huggingface.co",
        "blog_url": "https://huggingface.co/blog",
        "pricing_url": "https://huggingface.co/pricing",
        "docs_url": "https://huggingface.co/docs",
        "github_url": "https://github.com/huggingface",
        "industry": "AI Platform",
        "description": "AI platform for models, datasets, spaces, inference, and open-source ML.",
        "domain": "ai_genai",
    },
    {
        "name": "LangChain",
        "website_url": "https://www.langchain.com",
        "blog_url": "https://blog.langchain.com",
        "pricing_url": "https://www.langchain.com/pricing",
        "docs_url": "https://docs.langchain.com",
        "github_url": "https://github.com/langchain-ai/langchain",
        "industry": "AI Developer Tools",
        "description": "Framework and platform for LLM applications, agents, and observability.",
        "domain": "ai_genai",
    },
    {
        "name": "LlamaIndex",
        "website_url": "https://www.llamaindex.ai",
        "blog_url": "https://www.llamaindex.ai/blog",
        "pricing_url": "https://www.llamaindex.ai/pricing",
        "docs_url": "https://docs.llamaindex.ai",
        "github_url": "https://github.com/run-llama/llama_index",
        "industry": "RAG Developer Tools",
        "description": "Framework for building RAG applications and data agents.",
        "domain": "ai_genai",
    },
    {
        "name": "Pinecone",
        "website_url": "https://www.pinecone.io",
        "blog_url": "https://www.pinecone.io/blog/",
        "pricing_url": "https://www.pinecone.io/pricing/",
        "docs_url": "https://docs.pinecone.io",
        "github_url": "https://github.com/pinecone-io",
        "industry": "Vector Database",
        "description": "Managed vector database for semantic search and RAG applications.",
        "domain": "ai_genai",
    },
    {
        "name": "Weaviate",
        "website_url": "https://weaviate.io",
        "blog_url": "https://weaviate.io/blog",
        "pricing_url": "https://weaviate.io/pricing",
        "docs_url": "https://weaviate.io/developers/weaviate",
        "github_url": "https://github.com/weaviate/weaviate",
        "industry": "Vector Database",
        "description": "Open-source vector database for AI-native applications.",
        "domain": "ai_genai",
    },
    {
        "name": "Together AI",
        "website_url": "https://www.together.ai",
        "blog_url": "https://www.together.ai/blog",
        "pricing_url": "https://www.together.ai/pricing",
        "docs_url": "https://docs.together.ai",
        "github_url": "https://github.com/togethercomputer",
        "industry": "AI Infrastructure",
        "description": "AI cloud platform for model inference and fine-tuning.",
        "domain": "ai_genai",
    },
    {
        "name": "Groq",
        "website_url": "https://groq.com",
        "blog_url": "https://groq.com/news/",
        "pricing_url": "https://groq.com/pricing/",
        "docs_url": "https://console.groq.com/docs",
        "github_url": "https://github.com/groq",
        "industry": "AI Inference",
        "description": "Fast AI inference platform using LPU infrastructure.",
        "domain": "ai_genai",
    },
    {
        "name": "DeepSeek",
        "website_url": "https://www.deepseek.com",
        "blog_url": "https://www.deepseek.com",
        "pricing_url": "https://api-docs.deepseek.com/quick_start/pricing",
        "docs_url": "https://api-docs.deepseek.com",
        "github_url": "https://github.com/deepseek-ai",
        "industry": "Artificial Intelligence",
        "description": "AI company building language models, reasoning models, and developer APIs.",
        "domain": "ai_genai",
    },

    # ---------------- Mobile Phones ----------------
    {
        "name": "Apple",
        "website_url": "https://www.apple.com",
        "blog_url": "https://www.apple.com/newsroom/",
        "pricing_url": "https://www.apple.com/iphone/",
        "docs_url": "https://developer.apple.com/",
        "github_url": "https://github.com/apple",
        "industry": "Mobile Phones",
        "description": "Apple iPhone ecosystem tracking launches, iOS features, chips, cameras, and pricing.",
        "domain": "mobile_phones",
    },
    {
        "name": "Samsung",
        "website_url": "https://www.samsung.com",
        "blog_url": "https://news.samsung.com/global/category/mobile",
        "pricing_url": "https://www.samsung.com/global/mobile/",
        "docs_url": "https://developer.samsung.com/",
        "github_url": "https://github.com/Samsung",
        "industry": "Mobile Phones",
        "description": "Samsung Galaxy smartphone ecosystem tracking launches and mobile AI features.",
        "domain": "mobile_phones",
    },
    {
        "name": "Google Pixel",
        "website_url": "https://store.google.com/us/category/phones/",
        "blog_url": "https://blog.google/products/pixel/",
        "pricing_url": "https://store.google.com/us/category/phones/",
        "docs_url": "https://developer.android.com/",
        "github_url": "https://github.com/google",
        "industry": "Mobile Phones",
        "description": "Google Pixel smartphone line with Android and AI-powered features.",
        "domain": "mobile_phones",
    },
    {
        "name": "OnePlus",
        "website_url": "https://www.oneplus.com",
        "blog_url": "https://community.oneplus.com",
        "pricing_url": "https://www.oneplus.com/store/phone",
        "docs_url": "https://service.oneplus.com",
        "github_url": "https://github.com/OnePlusOSS",
        "industry": "Mobile Phones",
        "description": "OnePlus smartphone brand tracking launches, performance, charging, and pricing.",
        "domain": "mobile_phones",
    },
    {
        "name": "Xiaomi",
        "website_url": "https://www.mi.com",
        "blog_url": "https://www.mi.com/global/discover/newsroom/",
        "pricing_url": "https://www.mi.com/global/product-list/phone/",
        "docs_url": "https://www.mi.com/global/support/",
        "github_url": "https://github.com/xiaomi",
        "industry": "Mobile Phones",
        "description": "Xiaomi, Redmi, and POCO smartphone ecosystem.",
        "domain": "mobile_phones",
    },
    {
        "name": "Vivo",
        "website_url": "https://www.vivo.com",
        "blog_url": "https://www.vivo.com/en/about-vivo/news",
        "pricing_url": "https://www.vivo.com/en/products",
        "docs_url": "https://www.vivo.com/en/support",
        "github_url": "https://github.com/vivo",
        "industry": "Mobile Phones",
        "description": "Vivo smartphone brand tracking cameras, design, and regional launches.",
        "domain": "mobile_phones",
    },
    {
        "name": "Oppo",
        "website_url": "https://www.oppo.com",
        "blog_url": "https://www.oppo.com/en/newsroom/",
        "pricing_url": "https://www.oppo.com/en/smartphones/",
        "docs_url": "https://support.oppo.com",
        "github_url": "https://github.com/oppo",
        "industry": "Mobile Phones",
        "description": "Oppo smartphone brand focused on camera technology and design.",
        "domain": "mobile_phones",
    },
    {
        "name": "Realme",
        "website_url": "https://www.realme.com",
        "blog_url": "https://www.realme.com/global/newsroom",
        "pricing_url": "https://www.realme.com/global/realme-phones",
        "docs_url": "https://www.realme.com/global/support",
        "github_url": "https://github.com/realme",
        "industry": "Mobile Phones",
        "description": "Realme smartphone brand with value-focused product launches.",
        "domain": "mobile_phones",
    },
    {
        "name": "Motorola",
        "website_url": "https://www.motorola.com",
        "blog_url": "https://motorolanews.com/",
        "pricing_url": "https://www.motorola.com/us/smartphones",
        "docs_url": "https://en-us.support.motorola.com",
        "github_url": "https://github.com/motorola",
        "industry": "Mobile Phones",
        "description": "Motorola smartphone brand tracking mobile releases and market updates.",
        "domain": "mobile_phones",
    },
    {
        "name": "Nothing",
        "website_url": "https://nothing.tech",
        "blog_url": "https://nothing.tech/blogs/news",
        "pricing_url": "https://nothing.tech/pages/phone",
        "docs_url": "https://support.nothing.tech",
        "github_url": "https://github.com/nothing-tech",
        "industry": "Mobile Phones",
        "description": "Nothing smartphone brand focused on design, Nothing OS, and product strategy.",
        "domain": "mobile_phones",
    },

    # ---------------- Electric Vehicles ----------------
    {
        "name": "Tesla",
        "website_url": "https://www.tesla.com",
        "blog_url": "https://www.tesla.com/blog",
        "pricing_url": "https://www.tesla.com/models",
        "docs_url": "https://developer.tesla.com/",
        "github_url": "https://github.com/tesla",
        "industry": "Electric Vehicles",
        "description": "Tesla electric vehicles and clean energy ecosystem.",
        "domain": "electric_vehicles",
    },
    {
        "name": "BYD",
        "website_url": "https://www.byd.com/en",
        "blog_url": "https://www.byd.com/en/news",
        "pricing_url": "https://www.byd.com/en/auto",
        "docs_url": "https://www.byd.com/en/",
        "github_url": "https://github.com/byd",
        "industry": "Electric Vehicles",
        "description": "BYD battery and electric vehicle manufacturer.",
        "domain": "electric_vehicles",
    },
    {
        "name": "Rivian",
        "website_url": "https://rivian.com",
        "blog_url": "https://rivian.com/newsroom",
        "pricing_url": "https://rivian.com/r1t",
        "docs_url": "https://rivian.com",
        "github_url": "https://github.com/rivian",
        "industry": "Electric Vehicles",
        "description": "Rivian electric adventure vehicle manufacturer.",
        "domain": "electric_vehicles",
    },
    {
        "name": "Hyundai EV",
        "website_url": "https://www.hyundai.com",
        "blog_url": "https://www.hyundai.com/worldwide/en/newsroom",
        "pricing_url": "https://www.hyundai.com/worldwide/en/eco",
        "docs_url": "https://www.hyundai.com/worldwide/en",
        "github_url": "https://github.com/hyundai",
        "industry": "Electric Vehicles",
        "description": "Hyundai electric vehicle portfolio.",
        "domain": "electric_vehicles",
    },
    {
        "name": "Tata EV",
        "website_url": "https://ev.tatamotors.com",
        "blog_url": "https://ev.tatamotors.com/news",
        "pricing_url": "https://ev.tatamotors.com",
        "docs_url": "https://ev.tatamotors.com",
        "github_url": "https://github.com/tatamotors",
        "industry": "Electric Vehicles",
        "description": "Tata Motors electric vehicle ecosystem.",
        "domain": "electric_vehicles",
    },
    {
        "name": "Kia EV",
        "website_url": "https://www.kia.com",
        "blog_url": "https://www.kia.com/us/en/about-kia/news",
        "pricing_url": "https://www.kia.com/us/en/ev",
        "docs_url": "https://www.kia.com/",
        "github_url": "https://github.com/kia",
        "industry": "Electric Vehicles",
        "description": "Kia electric vehicle portfolio.",
        "domain": "electric_vehicles",
    },
    {
        "name": "Lucid Motors",
        "website_url": "https://www.lucidmotors.com",
        "blog_url": "https://www.lucidmotors.com/stories",
        "pricing_url": "https://www.lucidmotors.com/air",
        "docs_url": "https://www.lucidmotors.com/",
        "github_url": "https://github.com/lucidmotors",
        "industry": "Electric Vehicles",
        "description": "Lucid luxury electric vehicle manufacturer.",
        "domain": "electric_vehicles",
    },

    # ---------------- SaaS ----------------
    {
        "name": "Notion",
        "website_url": "https://www.notion.so",
        "blog_url": "https://www.notion.so/blog",
        "pricing_url": "https://www.notion.so/pricing",
        "docs_url": "https://developers.notion.com/",
        "github_url": "https://github.com/makenotion",
        "industry": "Productivity SaaS",
        "description": "All-in-one workspace for notes, docs, wikis, and collaboration.",
        "domain": "saas",
    },
    {
        "name": "Slack",
        "website_url": "https://slack.com",
        "blog_url": "https://slack.com/blog",
        "pricing_url": "https://slack.com/pricing",
        "docs_url": "https://api.slack.com/",
        "github_url": "https://github.com/slackapi",
        "industry": "Communication SaaS",
        "description": "Team communication and collaboration platform.",
        "domain": "saas",
    },
    {
        "name": "Linear",
        "website_url": "https://linear.app",
        "blog_url": "https://linear.app/blog",
        "pricing_url": "https://linear.app/pricing",
        "docs_url": "https://developers.linear.app/",
        "github_url": "https://github.com/linear",
        "industry": "Project Management SaaS",
        "description": "Issue tracking and project management tool for software teams.",
        "domain": "saas",
    },
    {
        "name": "Atlassian",
        "website_url": "https://www.atlassian.com",
        "blog_url": "https://www.atlassian.com/blog",
        "pricing_url": "https://www.atlassian.com/software/jira/pricing",
        "docs_url": "https://developer.atlassian.com/",
        "github_url": "https://github.com/atlassian",
        "industry": "DevOps SaaS",
        "description": "Software company behind Jira, Confluence, Trello, and developer tools.",
        "domain": "saas",
    },
    {
        "name": "HubSpot",
        "website_url": "https://www.hubspot.com",
        "blog_url": "https://blog.hubspot.com",
        "pricing_url": "https://www.hubspot.com/pricing",
        "docs_url": "https://developers.hubspot.com/",
        "github_url": "https://github.com/hubspot",
        "industry": "CRM SaaS",
        "description": "CRM, marketing, sales, and service software platform.",
        "domain": "saas",
    },
    {
        "name": "Salesforce",
        "website_url": "https://www.salesforce.com",
        "blog_url": "https://www.salesforce.com/blog/",
        "pricing_url": "https://www.salesforce.com/editions-and-pricing/",
        "docs_url": "https://developer.salesforce.com/",
        "github_url": "https://github.com/forcedotcom",
        "industry": "Enterprise CRM",
        "description": "Enterprise CRM and business cloud platform.",
        "domain": "saas",
    },
    {
        "name": "Monday.com",
        "website_url": "https://monday.com",
        "blog_url": "https://monday.com/blog",
        "pricing_url": "https://monday.com/pricing",
        "docs_url": "https://monday.com/api",
        "github_url": "https://github.com/mondaycom",
        "industry": "Work OS",
        "description": "Work operating system for collaboration and project management.",
        "domain": "saas",
    },

    # ---------------- E-commerce ----------------
    {
        "name": "Amazon",
        "website_url": "https://www.amazon.com",
        "blog_url": "https://www.aboutamazon.com/news",
        "pricing_url": "https://www.amazon.com/",
        "docs_url": "https://developer.amazon.com/",
        "github_url": "https://github.com/aws",
        "industry": "E-commerce",
        "description": "E-commerce and cloud platform.",
        "domain": "ecommerce",
    },
    {
        "name": "Flipkart",
        "website_url": "https://www.flipkart.com",
        "blog_url": "https://stories.flipkart.com/",
        "pricing_url": "https://www.flipkart.com/",
        "docs_url": "https://flipkart.github.io/",
        "github_url": "https://github.com/flipkart",
        "industry": "E-commerce",
        "description": "Indian e-commerce marketplace.",
        "domain": "ecommerce",
    },
    {
        "name": "Meesho",
        "website_url": "https://www.meesho.com",
        "blog_url": "https://www.meesho.io/blog",
        "pricing_url": "https://www.meesho.com/",
        "docs_url": "https://www.meesho.com/",
        "github_url": "https://github.com/meesho",
        "industry": "E-commerce",
        "description": "Social commerce and marketplace platform.",
        "domain": "ecommerce",
    },
    {
        "name": "Myntra",
        "website_url": "https://www.myntra.com",
        "blog_url": "https://www.myntra.com/news",
        "pricing_url": "https://www.myntra.com/",
        "docs_url": "https://www.myntra.com/",
        "github_url": "https://github.com/myntra",
        "industry": "Fashion E-commerce",
        "description": "Fashion e-commerce marketplace.",
        "domain": "ecommerce",
    },
    {
        "name": "Shopify",
        "website_url": "https://www.shopify.com",
        "blog_url": "https://www.shopify.com/blog",
        "pricing_url": "https://www.shopify.com/pricing",
        "docs_url": "https://developers.shopify.com/",
        "github_url": "https://github.com/shopify",
        "industry": "E-commerce Platform",
        "description": "E-commerce platform for online stores.",
        "domain": "ecommerce",
    },
    {
        "name": "eBay",
        "website_url": "https://www.ebay.com",
        "blog_url": "https://www.ebayinc.com/stories/news/",
        "pricing_url": "https://www.ebay.com/",
        "docs_url": "https://developer.ebay.com/",
        "github_url": "https://github.com/ebay",
        "industry": "Marketplace",
        "description": "Online marketplace for buying and selling goods.",
        "domain": "ecommerce",
    },

    # ---------------- FinTech ----------------
    {
        "name": "Razorpay",
        "website_url": "https://razorpay.com",
        "blog_url": "https://razorpay.com/blog/",
        "pricing_url": "https://razorpay.com/pricing/",
        "docs_url": "https://razorpay.com/docs/",
        "github_url": "https://github.com/razorpay",
        "industry": "Payment FinTech",
        "description": "Indian payment gateway and fintech platform.",
        "domain": "fintech",
    },
    {
        "name": "Stripe",
        "website_url": "https://stripe.com",
        "blog_url": "https://stripe.com/blog",
        "pricing_url": "https://stripe.com/pricing",
        "docs_url": "https://stripe.com/docs",
        "github_url": "https://github.com/stripe",
        "industry": "Payment FinTech",
        "description": "Online payment processing and fintech platform.",
        "domain": "fintech",
    },
    {
        "name": "Paytm",
        "website_url": "https://paytm.com",
        "blog_url": "https://paytm.com/blog",
        "pricing_url": "https://paytm.com/",
        "docs_url": "https://paytm.com/developer/",
        "github_url": "https://github.com/paytm",
        "industry": "Payment FinTech",
        "description": "Indian digital payments and fintech company.",
        "domain": "fintech",
    },
    {
        "name": "PhonePe",
        "website_url": "https://www.phonepe.com",
        "blog_url": "https://www.phonepe.com/blog/",
        "pricing_url": "https://www.phonepe.com/",
        "docs_url": "https://www.phonepe.com/business",
        "github_url": "https://github.com/phonepe",
        "industry": "Payment FinTech",
        "description": "Indian digital payments and mobile wallet platform.",
        "domain": "fintech",
    },
    {
        "name": "PayPal",
        "website_url": "https://www.paypal.com",
        "blog_url": "https://www.paypal.com/us/brc/blog",
        "pricing_url": "https://www.paypal.com/us/business/pricing",
        "docs_url": "https://developer.paypal.com/",
        "github_url": "https://github.com/paypal",
        "industry": "Payment FinTech",
        "description": "Global online payment and fintech platform.",
        "domain": "fintech",
    },
    {
        "name": "Revolut",
        "website_url": "https://www.revolut.com",
        "blog_url": "https://www.revolut.com/blog",
        "pricing_url": "https://www.revolut.com/en-US",
        "docs_url": "https://developer.revolut.com/",
        "github_url": "https://github.com/revolut",
        "industry": "Digital Banking",
        "description": "Digital banking and money transfer fintech company.",
        "domain": "fintech",
    },
]


def seed_domain_competitors():
    db = SessionLocal()

    inserted_count = 0
    updated_count = 0
    unchanged_count = 0

    try:
        for competitor_data in DOMAIN_COMPETITORS:
            existing_competitor = db.query(Competitor).filter(
                Competitor.name == competitor_data["name"]
            ).first()

            if existing_competitor:
                changed = False

                for field, value in competitor_data.items():
                    current_value = getattr(existing_competitor, field)

                    if current_value != value:
                        setattr(existing_competitor, field, value)
                        changed = True

                if changed:
                    updated_count += 1
                    print(f"Updated: {competitor_data['name']}")
                else:
                    unchanged_count += 1
                    print(f"Unchanged: {competitor_data['name']}")

            else:
                new_competitor = Competitor(**competitor_data)
                db.add(new_competitor)
                inserted_count += 1
                print(f"Inserted: {competitor_data['name']}")

        db.commit()

        print("\n" + "=" * 60)
        print("Seeding completed!")
        print("=" * 60)
        print(f"Inserted:  {inserted_count}")
        print(f"Updated:   {updated_count}")
        print(f"Unchanged: {unchanged_count}")
        print(f"Total:     {inserted_count + updated_count + unchanged_count}")
        print("=" * 60)

    except Exception as e:
        db.rollback()
        print(f"Error while seeding competitors: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_domain_competitors()