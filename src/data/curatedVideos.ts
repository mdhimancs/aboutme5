export interface CuratedVideo {
  id: string;
  title: string;
  institution: string;
  professor: string;
  category: string;
  thumbnail: string;
  link: string;
  description: string;
}

export const CURATED_VIDEOS: CuratedVideo[] = [
  {
    id: "karpathy-nn-hero",
    title: "Neural Networks: Zero to Hero",
    institution: "AI Engineering Masterclass",
    professor: "Andrej Karpathy (Ex-OpenAI / Tesla)",
    category: "Technology",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop",
    link: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
    description: "The definitive hands-on masterclass building neural networks, micrograd, and GPT from scratch in raw PyTorch."
  },
  {
    id: "mit-distributed-systems",
    title: "Distributed Systems Engineering",
    institution: "MIT 6.824",
    professor: "Prof. Robert Morris",
    category: "Architecture",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    link: "https://www.youtube.com/playlist?list=PLrw6aWdQRgX3k_0vJpuB9icDnmx5HSdTG",
    description: "The world-class masterclass on fault tolerance, Raft consensus algorithms, MapReduce, and scalable cloud architectures."
  },
  {
    id: "defcon-keynote",
    title: "DEF CON Hacker Keynotes & Briefings",
    institution: "DEF CON Security",
    professor: "Global Security Researchers",
    category: "Cybersecurity",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    link: "https://www.youtube.com/user/DEFCONConference",
    description: "The world's premier hacker conference archive covering zero-days, infrastructure exploitation, and offensive AI defense."
  },
  {
    id: "computerphile-crypto",
    title: "Cryptography & Security Masterclass",
    institution: "University of Nottingham",
    professor: "Prof. Brailsford & Dr. Mike Pound",
    category: "Cybersecurity",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
    link: "https://www.youtube.com/user/Computerphile",
    description: "Crystal clear breakdowns of RSA, AES, elliptic curve cryptography, quantum threat vectors, and protocol security."
  },
  {
    id: "google-beyondcorp",
    title: "BeyondCorp: Zero Trust Enterprise",
    institution: "Google Cloud",
    professor: "Security Engineering Leads",
    category: "Architecture",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop",
    link: "https://www.youtube.com/watch?v=XhYl6PAnG_M",
    description: "Architecting the original Zero Trust model shifting access controls from network perimeters to device and user identity."
  },
  {
    id: "lex-fridman-ai",
    title: "AI, AGI & Consciousness Masterclasses",
    institution: "Lex Fridman Podcast Archive",
    professor: "Demis Hassabis, Yann LeCun & Geoffrey Hinton",
    category: "Technology",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    link: "https://www.youtube.com/c/LexFridman",
    description: "Deep, unhurried technical dialogues with world leaders in artificial intelligence, neuroscience, and computational physics."
  },
  {
    id: "stanford-quantum-physics",
    title: "Quantum & Theoretical Physics",
    institution: "Stanford University",
    professor: "Prof. Leonard Susskind",
    category: "Science",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
    link: "https://www.youtube.com/playlist?list=PL84C10A9AC1D1DDC8",
    description: "The theoretical foundations of quantum mechanics, entanglement, and cosmological architecture for engineers and scientists."
  },
  {
    id: "mit-ai",
    title: "Artificial Intelligence: Knowledge & Reasoning",
    institution: "MIT",
    professor: "Prof. Patrick Winston",
    category: "Technology",
    thumbnail: "https://img.youtube.com/vi/TjZBTDzGeGg/hqdefault.jpg",
    link: "https://www.youtube.com/playlist?list=PLUl4u3cNGP63gFHB6xb-kVBiQHYe_4hSi",
    description: "The legendary MIT course on how we represent knowledge, build symbolic reasoning, and engineer intelligent systems."
  },
  {
    id: "mit-sicp",
    title: "SICP: Structure and Interpretation of Computer Programs",
    institution: "MIT",
    professor: "Abelson & Sussman",
    category: "Invention",
    thumbnail: "https://img.youtube.com/vi/2Op3QLzMgSY/hqdefault.jpg",
    link: "https://www.youtube.com/playlist?list=PLE188W7MUIuG67EBvyY0y2P-0I8l8uH2O",
    description: "Managing computational complexity through functional abstraction—the timeless masterpiece of computer science education."
  },
  {
    id: "harvard-justice",
    title: "Justice: The Right Thing To Do",
    institution: "Harvard University",
    professor: "Prof. Michael Sandel",
    category: "Behaviour",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
    link: "https://www.youtube.com/playlist?list=PL30CFeMCI1l9S49Wz9iL79fKLSigInYWG",
    description: "The most famous course in Harvard's history, exploring the philosophical architecture of human morality, ethics, and leadership."
  },
  {
    id: "oxford-penrose",
    title: "Consciousness & The Quantum Universe",
    institution: "Oxford University",
    professor: "Sir Roger Penrose (Nobel Laureate)",
    category: "Reality",
    thumbnail: "https://img.youtube.com/vi/3WXTX0IUaOg/hqdefault.jpg",
    link: "https://www.youtube.com/watch?v=3WXTX0IUaOg",
    description: "Nobel laureate Roger Penrose on the profound intersection of quantum physics, cosmology, and human consciousness."
  },
  {
    id: "stanford-behavior",
    title: "Human Behavioral Biology",
    institution: "Stanford University",
    professor: "Prof. Robert Sapolsky",
    category: "Behaviour",
    thumbnail: "https://img.youtube.com/vi/NNnIGh9g6fA/hqdefault.jpg",
    link: "https://www.youtube.com/playlist?list=PL848F619DA6B96451",
    description: "The global gold standard lecture series examining neurology, endocrinology, and evolutionary pressures shaping human actions."
  }
];

