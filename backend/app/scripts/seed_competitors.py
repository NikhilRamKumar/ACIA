from app.database.db import SessionLocal
from app.models.competitor import Competitor
from app.models.update import CompetitorUpdate

COMPETITORS = [
    {
        "name": "Google Gemini",
        "website_url": "https://gemini.google.com",
        "blog_url": "https://blog.google/technology/ai/",
        "pricing_url": "https://ai.google.dev/pricing",
        "docs_url": "https://ai.google.dev/gemini-api/docs",
        "github_url": "https://github.com/google-gemini",
        "industry": "Artificial Intelligence",
        "description": "Google's AI ecosystem including Gemini models, AI products, developer APIs, and AI-powered productivity tools.",
        "domain": "ai_genai"
    },
    {
        "name": "Mistral AI",
        "website_url": "https://mistral.ai",
        "blog_url": "https://mistral.ai/news",
        "pricing_url": "https://mistral.ai/pricing",
        "docs_url": "https://docs.mistral.ai",
        "github_url": "https://github.com/mistralai",
        "industry": "Artificial Intelligence",
        "description": "AI company building frontier open and commercial language models, APIs, and enterprise AI solutions.",
        "domain": "ai_genai"
    },
    {
        "name": "Cohere",
        "website_url": "https://cohere.com",
        "blog_url": "https://cohere.com/blog",
        "pricing_url": "https://cohere.com/pricing",
        "docs_url": "https://docs.cohere.com",
        "github_url": "https://github.com/cohere-ai",
        "industry": "Enterprise AI",
        "description": "Enterprise AI platform offering language models, embeddings, reranking, and retrieval-focused AI solutions.",
        "domain": "ai_genai"
    },
    {
        "name": "Meta AI",
        "website_url": "https://ai.meta.com",
        "blog_url": "https://ai.meta.com/blog/",
        "pricing_url": "https://ai.meta.com",
        "docs_url": "https://llama.meta.com/docs",
        "github_url": "https://github.com/meta-llama",
        "industry": "Artificial Intelligence",
        "description": "Meta's AI research and product ecosystem, including Llama models and AI assistant experiences.",
        "domain": "ai_genai"
    },
    {
        "name": "xAI",
        "website_url": "https://x.ai",
        "blog_url": "https://x.ai/news",
        "pricing_url": "https://docs.x.ai/developers/pricing",
        "docs_url": "https://docs.x.ai",
        "github_url": "https://github.com/xai-org",
        "industry": "Artificial Intelligence",
        "description": "AI company behind Grok models and xAI developer APIs for language, reasoning, vision, and multimodal capabilities.",
        "domain": "ai_genai"
    },
    {
        "name": "Hugging Face",
        "website_url": "https://huggingface.co",
        "blog_url": "https://huggingface.co/blog",
        "pricing_url": "https://huggingface.co/pricing",
        "docs_url": "https://huggingface.co/docs",
        "github_url": "https://github.com/huggingface",
        "industry": "AI Platform",
        "description": "AI community and platform for models, datasets, spaces, inference, transformers, and open-source machine learning.",
        "domain": "ai_genai"
    },
    {
        "name": "LangChain",
        "website_url": "https://www.langchain.com",
        "blog_url": "https://blog.langchain.com",
        "pricing_url": "https://www.langchain.com/pricing",
        "docs_url": "https://docs.langchain.com",
        "github_url": "https://github.com/langchain-ai/langchain",
        "industry": "AI Developer Tools",
        "description": "Framework and platform for building LLM applications, agents, workflows, observability, and production AI systems.",
        "domain": "ai_genai"
    },
    {
        "name": "LlamaIndex",
        "website_url": "https://www.llamaindex.ai",
        "blog_url": "https://www.llamaindex.ai/blog",
        "pricing_url": "https://www.llamaindex.ai/pricing",
        "docs_url": "https://docs.llamaindex.ai",
        "github_url": "https://github.com/run-llama/llama_index",
        "industry": "RAG Developer Tools",
        "description": "Framework for building retrieval-augmented generation applications, data agents, and knowledge-based LLM systems.",
        "domain": "ai_genai"
    },
    {
        "name": "Pinecone",
        "website_url": "https://www.pinecone.io",
        "blog_url": "https://www.pinecone.io/blog/",
        "pricing_url": "https://www.pinecone.io/pricing/",
        "docs_url": "https://docs.pinecone.io",
        "github_url": "https://github.com/pinecone-io",
        "industry": "Vector Database",
        "description": "Managed vector database platform for semantic search, RAG, recommendation systems, and AI applications.",
        "domain": "ai_genai"
    },
    {
        "name": "Weaviate",
        "website_url": "https://weaviate.io",
        "blog_url": "https://weaviate.io/blog",
        "pricing_url": "https://weaviate.io/pricing",
        "docs_url": "https://weaviate.io/developers/weaviate",
        "github_url": "https://github.com/weaviate/weaviate",
        "industry": "Vector Database",
        "description": "Open-source vector database for AI-native applications, semantic search, hybrid retrieval, and RAG systems.",
        "domain": "ai_genai"
    },
    {
        "name": "Together AI",
        "website_url": "https://www.together.ai",
        "blog_url": "https://www.together.ai/blog",
        "pricing_url": "https://www.together.ai/pricing",
        "docs_url": "https://docs.together.ai",
        "github_url": "https://github.com/togethercomputer",
        "industry": "AI Infrastructure",
        "description": "AI cloud platform for open-source model inference, fine-tuning, dedicated endpoints, and generative AI infrastructure.",
        "domain": "ai_genai"
    },
    {
        "name": "Groq",
        "website_url": "https://groq.com",
        "blog_url": "https://groq.com/news/",
        "pricing_url": "https://groq.com/pricing/",
        "docs_url": "https://console.groq.com/docs",
        "github_url": "https://github.com/groq",
        "industry": "AI Inference",
        "description": "Fast AI inference platform using LPUs for low-latency language model serving and developer APIs.",
        "domain": "ai_genai"
    },
    {
        "name": "DeepSeek",
        "website_url": "https://www.deepseek.com",
        "blog_url": "https://api-docs.deepseek.com/news",
        "pricing_url": "https://api-docs.deepseek.com/quick_start/pricing",
        "docs_url": "https://api-docs.deepseek.com",
        "github_url": "https://github.com/deepseek-ai",
        "industry": "Artificial Intelligence",
        "description": "AI company building language models, reasoning models, code models, and developer APIs.",
        "domain": "ai_genai"
    }
]


def seed_competitors():
    db = SessionLocal()

    inserted_count = 0
    skipped_count = 0

    try:
        for competitor_data in COMPETITORS:
            existing_competitor = db.query(Competitor).filter(
                Competitor.name == competitor_data["name"]
            ).first()

            if existing_competitor:
                print(f"Skipped: {competitor_data['name']} already exists")
                skipped_count += 1
                continue

            new_competitor = Competitor(**competitor_data)

            db.add(new_competitor)
            inserted_count += 1

            print(f"Inserted: {competitor_data['name']}")

        db.commit()

        print("\nSeeding completed")
        print(f"Inserted: {inserted_count}")
        print(f"Skipped: {skipped_count}")

    except Exception as e:
        db.rollback()
        print(f"Error while seeding competitors: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_competitors()