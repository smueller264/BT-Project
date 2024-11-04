export interface Slide {
    type: 'info' | 'question'
    content: string
    question?: string
    options?: string[]
    correctAnswer?: number
  }
  
  export const courseContent: Slide[] = [
    {
      type: 'info',
      content: 'Artificial Intelligence (AI) refers to systems or machines that perform tasks typically requiring human intelligence. These tasks include recognizing patterns, making decisions, and solving problems. AI is classified into narrow AI, which focuses on specific tasks, and general AI, which would have human-level intelligence across many tasks.'
    },
    {
      type: 'question',
      content: '',
      question: 'Which of the following is an example of narrow AI?',
      options: [
        'A robot that can do any task a human can do',
        'A calculator performing basic arithmetic',
        'An AI program playing chess at the world-champion leve',
        'A robot capable of understanding any human language?'
      ],
      correctAnswer: 2
    },
    {
      type: 'info',
      content: 'Machine learning is a subset of AI that enables systems to learn from data, identify patterns, and make decisions with minimal human intervention. In supervised learning, the system is trained on labeled data. In unsupervised learning, the system finds hidden patterns in unlabeled data.'
    },
    {
      type: 'question',
      content: '',
      question: 'In supervised learning, what type of data is used for training the AI model?',
      options: [
        'Randomly generated data',
        'Data labeled with the correct answers',
        'Data without any labels',
        'Data collected from unsupervised algorithms'
      ],
      correctAnswer: 1
    },
    {
      type: 'info',
      content: 'Artificial neural networks are algorithms inspired by the human brain. They consist of interconnected layers of nodes (neurons) that process data in stages. Neural networks are widely used in applications such as image recognition and natural language processing.'
    },
    {
      type: 'question',
      content: '',
      question: 'Which of the following is a key component of neural networks?',
      options: [
        'Random forests',
        'Gradient Boosting',
        'Layers of interconnected neurons',
        'Decision Trees'
      ],
      correctAnswer: 2
    },
    {
      type: 'info',
      content: 'AI systems often use algorithms to solve problems. For example, search algorithms help find the best solution by exploring all possible options. Heuristics are rules that simplify problem-solving by guiding the search towards a solution more quickly.'
    },
    {
      type: 'question',
      content: '',
      question: 'What is the primary function of a search algorithm in AI?',
      options: [
        'To provide a solution without exploring options',
        'To explore all possible solutions to a problem',
        'To improve the efficiency of machine learning models',
        'To calculate the fastest computational path'
      ],
      correctAnswer: 1
    },
    {
      type: 'info',
      content: 'Supervised learning requires labeled data, where the system learns from inputs and their correct outputs. Unsupervised learning works with unlabeled data, finding patterns or groupings within the data without specific instructions on what to look for.'
    },
    {
      type: 'question',
      content: '',
      question: 'Which learning method would be most suitable for classifying images into predefined categories?',
      options: [
        'Supervised learning',
        'Unsupervised learning',
        'Reinforcement learning',
        'Deep learning'
      ],
      correctAnswer: 0
    },
    {
      type: 'info',
      content: 'AI systems are heavily reliant on data. Data is used to train machine learning models and helps systems improve over time. Big data refers to large datasets that are used to extract valuable insights and patterns that might not be evident from smaller datasets.'
    },
    {
      type: 'question',
      content: '',
      question: 'What is a key advantage of using big data in AI?',
      options: [
        'It improves algorithm efficiency without any drawbacks',
        'It allows AI systems to discover patterns that smaller datasets cannot reveal',
        'It eliminates the need for supervised learning',
        'It guarantees that the AI system will be more accurate'
      ],
      correctAnswer: 1
    },
    {
      type: 'info',
      content: 'AI is increasingly integrated into our daily lives across various industries. For example, AI powers applications like voice assistants, autonomous systems, and personalized recommendations. Many tools we use today, from navigation apps to online shopping platforms, rely on AI to improve user experiences.'
    },
    {
      type: 'question',
      content: '',
      question: 'Which of the following is an everyday application of AI?',
      options: [
        'A coffee machine with a timer',
        'A smartphone assistant that responds to voice commands',
        'A regular light switch in your home',
        'A digital wristwatch with a stopwatch feature'
      ],
      correctAnswer: 1
    },
    {
      type: 'info',
      content: 'As AI technology advances, it raises several important ethical questions. These include concerns about data privacy, job displacement, and algorithmic bias. Governments, companies, and researchers are increasingly focused on ensuring that AI is developed and used responsibly, with proper safeguards to prevent unintended negative consequences.'
    },
    {
      type: 'question',
      content: '',
      question: 'Which of the following ethical concerns is most directly related to the widespread use of AI in decision-making systems?',
      options: [
        'AI systems could improve productivity, leading to fewer jobs',
        'AI algorithms may reinforce or amplify existing biases in data',
        'AI might reduce the need for human oversight in technical tasks',
        'AI could lead to energy consumption inefficiencies'
      ],
      correctAnswer: 1
    },
    {
      type: 'info',
      content: 'Reinforcement learning is a type of machine learning where an agent learns to make decisions by interacting with an environment. The agent receives rewards for actions that bring it closer to a desired goal and penalties for actions that hinder progress. Over time, the agent learns to maximize cumulative rewards. This method is often used in robotics, game-playing AI (like AlphaGo), and autonomous systems.'
    },
    {
      type: 'question',
      content: '',
      question: 'In reinforcement learning, how does an AI agent decide on the best action to take in an environment?',
      options: [
        'By memorizing all possible actions and their outcomes',
        'By learning from feedback in the form of rewards and penalties, adjusting its strategy over time',
        'By being programmed with the correct actions in advance',
        'By analyzing a static dataset of labeled actions and outcomes'
      ],
      correctAnswer: 1
    },
    {
      type: 'info',
      content: 'AI systems are increasingly being used in creative fields such as art, music, and writing. These systems learn from existing data, such as artistic styles or musical compositions, to create new, original content. However, there are ongoing debates about whether AI-generated creations can truly be considered "creative" and what role human input plays in the creative process.'
    },
    {
      type: 'question',
      content: '',
      question: 'Which statement best describes the role of AI in creative fields?',
      options: [
        'AI systems fully replace human artists by generating original content without any input',
        'AI learns patterns from existing works and generates new content based on those patterns, with varying levels of human guidance',
        'AI is unable to generate anything creative, as creativity is a uniquely human trait',
        'AI systems are only used to copy existing works rather than create new content'
      ],
      correctAnswer: 1
    }
  ]