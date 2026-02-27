export const portfolioData = {
	layout: {
		section_order: [
			"intro",
			"experience",
			"skills",
			"projects",
			"achievements",
			"notable_offers",
			"education",
			"contact",
		] as const,
	},
	theme: {
		defaultMode: "dark" as "light" | "dark",
	},
	personal: {
		name: "Souptik Sarkar",
		role: "Software Engineer",
		bio: "Software Engineer with 4 years of experience in designing scalable microservices and backend systems using Java, Go, Python, and JavaScript. Skilled in cloud infrastructure and database optimization.",
		email: "souptiksarkar4572@gmail.com",
		github: "https://github.com/souptik4572",
		linkedin: "https://www.linkedin.com/in/souptik4572/",
		location: "Bengaluru, Karnataka",
		resume: "https://bit.ly/Souptik_Sarkar_4YOE_SDE2",
	},
	skills: [
		{
			category: "Languages",
			items: ["Java", "Python", "Golang", "JavaScript", "TypeScript"],
		},
		{
			category: "Libraries/Frameworks",
			items: [
				"Spring Boot",
				"NodeJS",
				"Django",
				"ReactJS",
				"Redux",
				"Mongoose",
				"Prisma",
			],
		},
		{
			category: "Databases",
			items: [
				"MySQL",
				"PostgreSQL",
				"MongoDB",
				"DynamoDB",
				"SQLite",
				"Redis",
				"ElasticSearch",
			],
		},
		{
			category: "Infrastructure",
			items: ["AWS", "Nginx", "Bash", "Docker", "Kubernetes"],
		},
		{
			category: "Others",
			items: [
				"Git",
				"Postman",
				"Jira",
				"GitHub",
				"Bitbucket",
				"System Design",
				"OOP & Design Patterns",
			],
		},
	],
	experience: [
		{
			id: "exp-1",
			company: "Seamless Distribution Systems",
			companyLogo: "/images/companies/seamless.jpeg",
			companyWebsite: "https://seamless.se/",
			role: "Software Engineer",
			period: "July 2022 - Present",
			location: "Remote - Bengaluru, Karnataka",
			highlights: [
				"Took ownership of key microservices in the Electronic Recharge System (ERS), maintaining high performance and system reliability across reporting, access control, OTP, and loyalty modules.",
				"Resolved N+1 query issues and optimized Elasticsearch and SQL queries, reducing report generation time by over 1000ms.",
				"Re-architected the Access Management Service by decoupling approval workflows and introducing role-based access control (RBAC), reducing approval time by 70% and improving system throughput.",
				"Developed a log ingestion service using Go and Gin to collect and process logs from 10+ microservices, transforming and indexing audit and data feeds into Elasticsearch for centralized search and analysis.",
			],
		},
		{
			id: "exp-2",
			company: "Solulab",
			companyLogo: "/images/companies/solulab.png",
			companyWebsite: "https://www.solulab.com/",
			role: "Backend Developer",
			period: "February 2022 - June 2022",
			location: "Ahmedabad, Gujarat",
			highlights: [
				"Designed and implemented 2 scalable backend services and APIs (REST, GraphQL) for an NFT marketplace, supporting 10K+ active users and enabling core features like asset creation and trading.",
				"Optimized database queries and API logic, achieving an average response time of under 50ms and improving endpoint performance by 15%.",
				"Integrated blockchain components using Web3.js and Ethers.js, supporting real-time NFT minting, bulk uploads (1K+), and token analytics.",
				"Collaborated closely with front-end and product teams in an Agile environment to define GraphQL API contracts and implement reward-based gameplay features, delivering 20+ new endpoints.",
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
			tech: [
				"TypeScript",
				"Node.js",
				"Socket.io",
				"MongoDB",
				"Tailwind CSS",
			],
			description:
				"Modern chat application with real-time messaging, file sharing, and presence indicators. Built with WebSocket connections and optimistic UI updates for instant feedback.",
			github: "https://github.com/souptik4572/realtime-chat",
			live: "https://chat.souptik.dev",
		},
	],
	achievements: [
		{
			id: "ach-1",
			title: "Smart India Hackathon Finalist",
			date: "2020",
			description:
				"Qualified for the finals of Smart India Hackathon 2020, competing among 100,000+ participants nationwide.",
		},
		{
			id: "ach-2",
			title: "Research Intern at DRDO",
			date: "2021", // Approximated based on typical B.Tech timeline, feel free to adjust!
			description:
				"Selected for a research internship at the Defence Research and Development Organisation (DRDO), contributing to a project on Meteorological Data Analysis.",
		},
	],
	notable_offers: [
		{
			id: "offer-1",
			company: "Twilio",
			companyLogo: "/images/companies/twilio.svg",
			role: "Software Engineer 2",
			period: "November 2025",
			companyUrl: "https://www.twilio.com/",
		},
		{
			id: "offer-2",
			company: "Navi",
			companyLogo: "/images/companies/navi.png",
			role: "Software Engineer",
			period: "October 2023",
			companyUrl: "https://navi.com/",
		},
		{
			id: "offer-3",
			company: "UNO Digital Bank",
			companyLogo: "/images/companies/unobank.png",
			role: "Software Engineer",
			period: "February 2023",
			companyUrl: "https://uno.bank/",
		},
		{
			id: "offer-4",
			company: "Tracxn",
			companyLogo: "/images/companies/tracxn.jpeg",
			role: "Software Engineer",
			period: "September 2022",
			companyUrl: "https://tracxn.com/",
		},
		{
			id: "offer-5",
			company: "Cricbuzz",
			companyLogo: "/images/companies/cricbuzz.svg",
			role: "Software Engineer",
			period: "May 2022",
			companyUrl: "https://www.cricbuzz.com/",
		},
		{
			id: "offer-6",
			company: "Tejas Networks",
			companyLogo: "/images/companies/tejas.jpeg",
			role: "Software Engineer",
			period: "March 2022",
			companyUrl: "https://www.tejasnetworks.com/",
		},
		{
			id: "offer-7",
			company: "Zaggle",
			companyLogo: "/images/companies/zaggle.svg",
			role: "Software Engineer",
			period: "November 2021",
			companyUrl: "https://www.zaggle.in/",
		},
	],
	education: [
		{
			id: "edu-1",
			institution: "University of Engineering and Management",
			degree: "Bachelor's of Technology (B.Tech) in Computer Science & Engineering",
			period: "2018 - 2022",
			gpa: "9.35 CGPA",
		},
	],
};

export type PortfolioData = typeof portfolioData;
export type SectionKey = (typeof portfolioData.layout.section_order)[number];
