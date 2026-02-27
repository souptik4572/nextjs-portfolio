export const portfolioData = {
  layout: {
    section_order: [
      "intro",
      "experience",
      "skills",
      "projects",
      "education",
      "contact",
    ] as const,
  },
  theme: {
    defaultMode: "dark" as "light" | "dark", // Default theme mode
  },
  personal: {
    name: "Souptik Sarkar",
    role: "Software Engineer",
    bio: "Polyglot engineer at heart. Deep expertise in Java and Spring Boot, frequently building high-performance services in Golang and Python.",
    email: "souptik4572@gmail.com",
    github: "https://github.com/souptik4572",
    linkedin: "https://www.linkedin.com/in/souptik4572/",
    location: "Kolkata, India",
  },
  skills: [
    { 
      category: "Languages", 
      items: ["Java", "Python", "Golang", "JavaScript", "TypeScript"] 
    },
    {
      category: "Libraries/Frameworks",
      items: ["Spring Boot", "NodeJS", "Django", "ReactJS", "Redux", "Mongoose", "Prisma"],
    },
    {
      category: "Databases",
      items: ["MySQL", "PostgreSQL", "MongoDB", "DynamoDB", "SQLite", "Redis", "ElasticSearch"],
    },
    { 
      category: "Infrastructure", 
      items: ["AWS", "Nginx", "Bash", "Docker", "Kubernetes"] 
    },
    { 
      category: "Others", 
      items: ["Git", "Postman", "Jira", "GitHub", "Bitbucket", "System Design"] 
    },
  ],
  experience: [
    {
      id: "exp-1",
      company: "FinTech Corp",
      role: "Software Engineer II (SDE-2)",
      period: "Jan 2023 – Present",
      location: "Bengaluru, India",
      highlights: [
        "Architected and scaled a Java/Spring Boot microservices platform processing 50K+ transactions per second with sub-10ms p99 latency.",
        "Designed event-driven pipelines using Apache Kafka, reducing inter-service coupling and improving fault tolerance across 12 services.",
        "Led migration of legacy monolith to containerized microservices on AWS EKS, cutting deployment times by 70%.",
        "Integrated a React.js dashboard (Next.js) with REST and GraphQL APIs, improving recruiter-facing tooling and team productivity.",
      ],
    },
    {
      id: "exp-2",
      company: "CloudBase Technologies",
      role: "Software Engineer I (SDE-1)",
      period: "Jul 2021 – Dec 2022",
      location: "Remote",
      highlights: [
        "Built high-throughput data-ingestion services in Golang capable of handling 1M+ events/day with horizontal auto-scaling on AWS EC2.",
        "Developed internal tooling in Python (FastAPI) for log aggregation and anomaly detection, saving 4+ engineering hours per week.",
        "Optimized critical SQL queries and DynamoDB access patterns, reducing average query response time by 60%.",
        "Contributed to UI components in React.js to surface backend analytics data for product and business stakeholders.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "macOS-Inspired Portfolio",
      tech: ["React.js", "GSAP", "CSS Modules"],
      description:
        "A pixel-perfect macOS desktop simulation built as a personal portfolio. Features animated dock, draggable windows, and smooth GSAP-powered transitions.",
      github: "https://github.com/souptik4572/macos-portfolio",
      live: null,
    },
    {
      id: "proj-2",
      title: "Full-Stack Calendar App",
      tech: ["Next.js", "Prisma", "Shadcn/UI", "PostgreSQL"],
      description:
        "A production-grade calendar application with drag-and-drop event scheduling, recurring events, and timezone support, backed by Prisma ORM and PostgreSQL.",
      github: "https://github.com/souptik4572/calendar-app",
      live: null,
    },
    {
      id: "proj-3",
      title: "Scalable YouTube Downloader",
      tech: ["Python", "FastAPI", "Redis", "Docker", "AWS S3"],
      description:
        "Distributed architecture for downloading and transcoding YouTube videos at scale. Uses Redis-backed job queues, Docker workers, and S3 for storage.",
      github: "https://github.com/souptik4572/yt-downloader",
      live: null,
    },
    {
      id: "proj-4",
      title: "Real-Time Chat Platform",
      tech: ["TypeScript", "Node.js", "Socket.io", "MongoDB", "Tailwind CSS"],
      description:
        "Modern chat application with real-time messaging, file sharing, and presence indicators. Built with WebSocket connections and optimistic UI updates for instant feedback.",
      github: "https://github.com/souptik4572/realtime-chat",
      live: "https://chat.souptik.dev",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "National Institute of Technology, Durgapur",
      degree: "Bachelor of Technology – Computer Science & Engineering",
      period: "2017 – 2021",
      gpa: "8.4 / 10",
    },
  ],
};

export type PortfolioData = typeof portfolioData;
export type SectionKey = (typeof portfolioData.layout.section_order)[number];
