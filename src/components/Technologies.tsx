import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const techCategories = [
  {
    category: 'Frontend',
    color: 'violet',
    techs: ['React', 'Angular', 'Next.js', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript'],
  },
  {
    category: 'Backend',
    color: 'purple',
    techs: ['Python', 'Node.js', 'Java', '.NET'],
  },
  {
    category: 'Databases',
    color: 'violet',
    techs: ['MongoDB', 'MySQL', 'PostgreSQL'],
  },
  {
    category: 'Cloud',
    color: 'purple',
    techs: ['AWS', 'Azure', 'Google Cloud'],
  },
  {
    category: 'DevOps',
    color: 'violet',
    techs: ['Docker', 'Git', 'GitHub', 'CI/CD'],
  },
  {
    category: 'Artificial Intelligence',
    color: 'purple',
    techs: ['OpenAI', 'Google Gemini', 'Google ADK', 'LangChain', 'Machine Learning'],
  },
];

export default function Technologies() {
  const ref = useScrollAnimation();
  const gridRef = useScrollAnimation();

  return (
    <section className="bg-white section-padding">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="animate-on-scroll text-center mb-14">
          <p className="section-subtitle">Our Stack</p>
          <h2 className="section-title mb-4">
            Technologies We <span className="gradient-text">Master</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Leveraging the latest and most reliable technologies to build future-ready solutions.
          </p>
        </div>

        <div ref={gridRef} className="animate-on-scroll grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map(cat => (
            <div key={cat.category} className="card group">
              <h3 className="font-poppins font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-700 inline-block" />
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.techs.map(tech => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-violet-50 hover:bg-violet-700 hover:text-white text-violet-800 rounded-lg text-sm font-medium transition-colors duration-200 cursor-default border border-violet-100 hover:border-violet-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
