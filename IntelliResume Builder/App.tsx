import React, { useState, useMemo, useEffect } from 'react';
import type { SharedData, RoleData } from './types.ts';
import TabBar from './components/TabBar.tsx';
import ResumeDocument from './components/ResumeDocument.tsx';
import AddRoleModal from './components/AddRoleModal.tsx';

// --- INITIAL DATA (DEMO DATA) ---
const initialSharedData: SharedData = {
  name: 'Varad Kodgire',
  email: 'itsvaradkodgire@gmail.com',
  phone: '8805200924',
  github: 'github.com/itsvaradkodgire',
  linkedin: 'linkedin.com/in/varad-kodgire',
  education: [
    { id: 'edu1', school: 'CDAC Bangalore', degree: 'Post Graduate Diploma in Big Data Analytics', dateRange: 'Sep 2024 - Feb 2025', details: 'Grade: A | Per: 74.38%' },
    { id: 'edu2', school: 'MMCOE, Pune', degree: 'B.E. in Electronics and Telecommunication', dateRange: 'Oct 2020 - May 2024', details: 'CGPA: 7.2' },
    { id: 'edu3', school: 'Shivaji College, Nanded', degree: 'Higher Secondary(12th)', dateRange: 'Feb 2020', details: 'Per: 55.38%' },
    { id: 'edu4', school: 'Yeshwant Mahavidyalaya, Nanded', degree: 'Higher Secondary', dateRange: 'May 2019', details: 'Per: 57.23%' },
    { id: 'edu5', school: 'Anna Bhau Sathe, Mukhed', degree: 'Secondary', dateRange: 'Mar 2018', details: 'Per: 89.40%' },
  ],
};

const initialRoles: RoleData[] = [
  {
    id: 'role_1',
    roleName: 'Data Analyst',
    summary: "I am an engineering graduate in Electronics & Telecommunication from MMCOE, Pune, with additional training in Big Data Analytics from CDAC Bangalore. I have worked on academic and hands-on projects involving data analysis, visualisation, and scalable data processing using Python, SQL, Excel, Power BI, and PySpark. I'm keen on using data to uncover patterns, support business decisions, and contribute to real-world problem-solving through analytics and automation.",
    skills: [
        { id: 'skillcat1', category: 'Languages', list: 'Python, Java, SQL, HTML, CSS' },
        { id: 'skillcat2', category: 'Technologies & Tools', list: 'Hadoop, Spark, PySpark, Git, GitHub, VSCode, Visual Studio, Anaconda' },
        { id: 'skillcat3', category: 'Machine Learning & Deep Learning', list: 'PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy' },
        { id: 'skillcat4', category: 'Databases', list: 'MySQL, MongoDB' },
        { id: 'skillcat5', category: 'Visualisation', list: 'Tableau, Power BI, MS Excel, Matplotlib, Seaborn' },
    ],
    projects: [
      {
        id: 'proj_1',
        name: 'TapVision: An AI-Powered Accessibility Tool',
        description: 'TapVision is an accessible, voice-enabled application designed to extract text from diverse sources (documents, images, URLs) and convert it into speech. It bridges the gap between visual content and auditory accessibility, with added features like translation and summarisation.',
        technologies: 'Python, gTTS, NLP, APIs, Streamlit',
      },
      {
        id: 'proj_2',
        name: 'Sentiment Analysis Pipeline',
        description: 'In this, I analyse social media posts (like tweets or comments) to determine whether they express positive, negative, or neutral emotions. It processes large amounts of text data efficiently using Hadoop for storage and PySpark for fast, distributed computing.',
        technologies: 'PySpark, Hadoop, Python',
      },
      {
        id: 'proj_3',
        name: 'Library Management System (College)',
        description: 'Developed a Java-based Library Management System with NFC integration, enabling seamless book borrowing/exchanges. Automated workflows reduced librarian workload by 30% while SQL-driven analytics improved inventory decisions. Handled backend connectivity, data security, and transaction tracking using JDBC and Mysql.',
        technologies: 'Java, MySQL, JDBC, Excel',
      },
    ],
    certifications: [
        'Python for Data Science by IBM',
        'MySQL by Nikolai Schuler',
    ],
    hobbies: 'Coding, Swimming, Reading, Gym, Wingsuit Flying',
  },
];

// --- Helper to safely load state from localStorage ---
const loadState = <T,>(key: string, defaultValue: T): T => {
    try {
        const serializedState = localStorage.getItem(key);
        if (serializedState === null) {
            return defaultValue;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.warn(`Error loading state for key "${key}" from localStorage:`, err);
        return defaultValue;
    }
};

// --- APP COMPONENT ---
const App: React.FC = () => {
  const [sharedData, setSharedData] = useState<SharedData>(() => loadState('intelliresume_sharedData', initialSharedData));
  const [roles, setRoles] = useState<RoleData[]>(() => loadState('intelliresume_roles', initialRoles));
  
  const [activeRoleId, setActiveRoleId] = useState<string>(() => {
    const savedRoles = loadState<RoleData[]>('intelliresume_roles', initialRoles);
    const savedActiveId = loadState<string | null>('intelliresume_activeRoleId', null);
    
    // Ensure the saved active ID is valid for the loaded roles
    if (savedActiveId && savedRoles.some(r => r.id === savedActiveId)) {
      return savedActiveId;
    }
    // Fallback to the first available role
    return savedRoles[0]?.id || initialRoles[0].id;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('intelliresume_sharedData', JSON.stringify(sharedData));
  }, [sharedData]);

  useEffect(() => {
    localStorage.setItem('intelliresume_roles', JSON.stringify(roles));
  }, [roles]);
  
  useEffect(() => {
    // Ensure we don't save an invalid ID if roles are still loading or empty
    if (roles.some(r => r.id === activeRoleId)) {
        localStorage.setItem('intelliresume_activeRoleId', activeRoleId);
    }
  }, [activeRoleId, roles]);


  const activeRoleData = useMemo(() => {
    return roles.find((role) => role.id === activeRoleId) ?? roles[0];
  }, [roles, activeRoleId]);

  const handleUpdateSharedData = (data: Partial<SharedData>) => {
    setSharedData((prev) => ({ ...prev, ...data }));
  };

  const handleUpdateRoleData = (data: Partial<Omit<RoleData, 'id' | 'roleName'>>) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === activeRoleId ? { ...role, ...data } : role
      )
    );
  };

  const handleAddRole = (roleName: string, copyFromId?: string) => {
    const newId = `role_${Date.now()}`;
    let newRole: RoleData;

    const sourceRole = roles.find(r => r.id === copyFromId);

    if (sourceRole) {
      newRole = {
        ...JSON.parse(JSON.stringify(sourceRole)), // Deep copy for safety
        id: newId,
        roleName: roleName,
      };
    } else {
      // Create a minimal new role
      newRole = {
        id: newId,
        roleName: roleName,
        summary: '',
        skills: [],
        projects: [],
        certifications: [],
        hobbies: '',
      };
    }

    setRoles((prev) => [...prev, newRole]);
    setActiveRoleId(newId);
    setIsModalOpen(false);
  };
  
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to the original demo? All your changes will be lost.')) {
        // Clear from localStorage
        localStorage.removeItem('intelliresume_sharedData');
        localStorage.removeItem('intelliresume_roles');
        localStorage.removeItem('intelliresume_activeRoleId');

        // Reset state
        setSharedData(initialSharedData);
        setRoles(initialRoles);
        setActiveRoleId(initialRoles[0].id);
    }
  };

  // Render null if there's no active role data (e.g., all roles deleted)
  if (!activeRoleData) {
      // In a more robust app, we'd show a "create a role" screen
      // For now, we add a default role if everything is empty
       if (roles.length === 0) {
           const newId = `role_${Date.now()}`;
           const newRole = {
                id: newId,
                roleName: "First Role",
                summary: 'New summary...',
                skills: [],
                projects: [],
                certifications: [],
                hobbies: '',
           };
           setRoles([newRole]);
           setActiveRoleId(newId);
       }
      return null;
  }

  return (
    <div className="min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10 no-print">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">IntelliResume Builder</h1>
            <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
                Export to PDF
            </button>
         </div>
      </header>

      <TabBar
        roles={roles}
        activeRoleId={activeRoleId}
        onSelectRole={setActiveRoleId}
        onAddRoleClick={() => setIsModalOpen(true)}
      />

      <ResumeDocument
        sharedData={sharedData}
        roleData={activeRoleData}
        onUpdateSharedData={handleUpdateSharedData}
        onUpdateRoleData={handleUpdateRoleData}
      />

      <AddRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddRole={handleAddRole}
        existingRoles={roles}
      />
      
      <footer className="text-center py-6 text-sm text-slate-500 no-print">
        <p>Built with React, TypeScript, and Tailwind CSS.</p>
        <button 
            onClick={handleResetData} 
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
        >
            Reset to Demo Data
        </button>
      </footer>
    </div>
  );
};

export default App;