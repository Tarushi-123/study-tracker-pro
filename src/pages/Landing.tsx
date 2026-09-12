import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CalendarCheck,
  Bell,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  Star,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Track Assignments",
    description:
      "Never miss a deadline again. Add assignments with due dates, priorities, and subjects all in one place.",
  },
  {
    icon: BookOpen,
    title: "Class Test Prep",
    description:
      "Stay ahead of exam schedules. Track upcoming class tests and prepare with confidence.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Automatic urgency alerts — Due Today, Due Tomorrow, Due Soon, and Overdue indicators keep you on track.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Visualize your weekly progress and subject-wise completion rates with beautiful charts.",
  },
  {
    icon: CheckCircle2,
    title: "Status Management",
    description:
      "Move tasks through Not Started → In Progress → Completed with a single click.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your data is protected with row-level security. Only you can see your tasks.",
  },
];

const stats = [
  { value: "100%", label: "Free to Use" },
  { value: "0", label: "Ads or Spam" },
  { value: "24/7", label: "Availability" },
  { value: "∞", label: "Tasks Supported" },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "Computer Science Student",
    text: "StudyPro completely changed how I manage my semester. I haven't missed a single deadline since I started using it.",
  },
  {
    name: "Alex M.",
    role: "Mechanical Engineering",
    text: "The subject-wise progress view is a game changer. I can instantly see which courses need more attention.",
  },
  {
    name: "Jordan K.",
    role: "Business Administration",
    text: "Clean, fast, and does exactly what I need. The urgency badges alone are worth it — no more panicked all-nighters.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0e6d8]">
      {/* Navigation */}
      <nav className="bg-[#faf5ee]/80 backdrop-blur-md border-b border-[#e8dfd2] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#8b7355] to-[#a69580] flex items-center justify-center shadow-[2px_2px_4px_#d4c9ba,-2px_-2px_4px_#ffffff]">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-lg font-bold text-[#3d3429]">StudyPro</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="text-[#8b7355] hover:text-[#5a4d3e] hover:bg-[#e8dfd2]"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                className="bg-[#8b7355] hover:bg-[#6b5b47] text-white shadow-[3px_3px_6px_#d4c9ba,-3px_-3px_6px_#ffffff]"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#faf5ee] border border-[#e8dfd2] shadow-[3px_3px_6px_#d4c9ba,-3px_-3px_6px_#ffffff] mb-6">
              <Zap className="h-4 w-4 text-[#8b7355]" />
              <span className="text-sm font-medium text-[#6b5b47]">
                Built for college students
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3d3429] leading-tight">
              Never Miss a{" "}
              <span className="bg-gradient-to-r from-[#8b7355] to-[#a69580] bg-clip-text text-transparent">
                Deadline
              </span>{" "}
              Again
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#8b7355] max-w-2xl mx-auto leading-relaxed">
              StudyPro helps college students track assignments, class tests, and
              study schedules. Stay organized, meet every deadline, and watch your
              grades improve.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-[#8b7355] hover:bg-[#6b5b47] text-white shadow-[4px_4px_8px_#d4c9ba,-4px_-4px_8px_#ffffff] px-8 py-6 text-base"
              >
                Start Tracking — It's Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-[#faf5ee] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2] px-8 py-6 text-base shadow-[4px_4px_8px_#d4c9ba,-4px_-4px_8px_#ffffff]"
              >
                See Features
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual - Task Cards Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[12px_12px_24px_#d4c9ba,-12px_-12px_24px_#ffffff] p-6 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs text-[#8b7355] font-medium">
                  StudyPro Dashboard
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total", value: "12", color: "bg-blue-100" },
                  { label: "Pending", value: "7", color: "bg-amber-100" },
                  { label: "In Progress", value: "3", color: "bg-orange-100" },
                  { label: "Completed", value: "2", color: "bg-emerald-100" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`${stat.color} rounded-xl p-3 text-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]`}
                  >
                    <p className="text-xl font-bold text-[#3d3429]">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-[#8b7355]">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-2">
                {[
                  {
                    title: "DSA Assignment — Graph Algorithms",
                    badge: "🔴 Due Today",
                    badgeColor: "bg-red-100 text-red-700",
                  },
                  {
                    title: "Java OOP Mid-Term",
                    badge: "🟠 Due Tomorrow",
                    badgeColor: "bg-orange-100 text-orange-700",
                  },
                  {
                    title: "Maths — Linear Algebra Problem Set",
                    badge: "🟡 Due Soon",
                    badgeColor: "bg-amber-100 text-amber-700",
                  },
                ].map((task) => (
                  <div
                    key={task.title}
                    className="flex items-center justify-between p-3 bg-[#f0e6d8] rounded-xl shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#c4b8a8]" />
                      <span className="text-sm font-medium text-[#3d3429]">
                        {task.title}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-1 rounded-full ${task.badgeColor}`}
                    >
                      {task.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#faf5ee] border-y border-[#e8dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-3xl font-bold text-[#8b7355]">
                  {stat.value}
                </p>
                <p className="text-sm text-[#6b5b47] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3d3429]">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-[#8b7355] to-[#a69580] bg-clip-text text-transparent">
                Stay on Track
              </span>
            </h2>
            <p className="mt-4 text-lg text-[#8b7355] max-w-xl mx-auto">
              Purpose-built tools for college students who want to stay organized
              and perform their best.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-[#faf5ee] rounded-2xl p-6 border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] hover:shadow-[8px_8px_16px_#d4c9ba,-8px_-8px_16px_#ffffff] transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#8b7355] to-[#a69580] flex items-center justify-center shadow-[3px_3px_6px_#d4c9ba,-3px_-3px_6px_#ffffff] mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#3d3429] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#8b7355] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-[#faf5ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3d3429]">
              Up and Running in{" "}
              <span className="bg-gradient-to-r from-[#8b7355] to-[#a69580] bg-clip-text text-transparent">
                30 Seconds
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up with your email. No credit card, no complicated setup.",
                icon: GraduationCap,
              },
              {
                step: "02",
                title: "Add Your Tasks",
                desc: "Enter assignments and class tests with due dates, subjects, and priorities.",
                icon: CalendarCheck,
              },
              {
                step: "03",
                title: "Stay Ahead",
                desc: "Let smart urgency badges and progress tracking keep you on schedule.",
                icon: Star,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#f0e6d8] border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] mb-4">
                  <item.icon className="h-8 w-8 text-[#8b7355]" />
                </div>
                <p className="text-xs font-bold text-[#a69580] tracking-widest mb-2">
                  STEP {item.step}
                </p>
                <h3 className="text-lg font-semibold text-[#3d3429] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#8b7355]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3d3429]">
              Loved by{" "}
              <span className="bg-gradient-to-r from-[#8b7355] to-[#a69580] bg-clip-text text-transparent">
                Students
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-[#faf5ee] rounded-2xl p-6 border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-[#8b7355] text-[#8b7355]"
                    />
                  ))}
                </div>
                <p className="text-sm text-[#6b5b47] leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-[#3d3429]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#8b7355]">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-[#faf5ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#8b7355] to-[#6b5b47] rounded-3xl p-10 sm:p-16 text-center shadow-[12px_12px_24px_#d4c9ba,-12px_-12px_24px_#ffffff]"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Ace Your Semester?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Join students who are already using StudyPro to stay on top of
              every assignment and exam.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-[#6b5b47] hover:bg-white/90 shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.1)] px-10 py-6 text-base font-semibold"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3d3429] text-white/70 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-sm font-semibold text-white">StudyPro</span>
            </div>
            <p className="text-xs text-white/50">
              Built with ❤️ for college students. All your data stays private.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
