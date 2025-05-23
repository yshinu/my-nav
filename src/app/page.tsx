"use client"; // This is important for Framer Motion to work in Next.js App Router

import Link from "next/link";
import { useTheme } from "next-themes";
import { FaPlus } from "react-icons/fa";
import { Trash2 } from "lucide-react"; // Import Trash2 icon
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState([
    { id: 1, title: "个人博客", description: "分享我的技术文章和学习心得", url: "https://your-blog-link.com" },
    { id: 2, title: "网盘链接", description: "存放我的项目文件和资源", url: "https://your-cloud-storage-link.com" }
  ]);
  const [newProject, setNewProject] = useState({ title: "", description: "", url: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-2 sm:p-4 md:p-8">
      <div
        className="bg-white/30 dark:bg-gray-800/30 shadow-xl rounded-3xl backdrop-blur-xl backdrop-saturate-150 p-4 sm:p-6 md:p-10 max-w-4xl w-full text-center relative"
      >
        <button
          onClick={() => {
            console.log(theme)
            setTheme(theme === "dark" ? "light" : "dark")
          }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 text-gray-800 dark:text-gray-200 font-medium py-1 px-2 sm:py-2 sm:px-4 rounded-full transition duration-300 backdrop-blur-sm backdrop-saturate-125"
        >
          切换主题 ({theme === "dark" ? "深色" : "浅色"})
        </button>
        {/* Cover Section */}
        <div
          className="mb-12 text-center"
        >
          <h1
            className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
          >
            创新驱动发展
          </h1>
          <p
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            探索前沿技术，创造卓越体验。专注全栈开发与用户体验设计，打造高性能Web应用。
          </p>
        </div>

        {/* Project Creation with Dialog */}
        <div className="mb-12 w-full max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">新增项目</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600/90 hover:bg-blue-700/90 text-white px-6 py-3 rounded-lg flex items-center gap-2 w-full justify-center">
                <FaPlus className="w-5 h-5" />
                添加新项目
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">新增项目</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300">
                  填写项目信息，点击添加完成。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    项目名称
                  </Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, title: e.target.value })}
                    className="col-span-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    项目描述
                  </Label>
                  <Input
                    id="description"
                    value={newProject.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, description: e.target.value })}
                    className="col-span-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    项目链接
                  </Label>
                  <Input
                    id="url"
                    value={newProject.url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, url: e.target.value })}
                    className="col-span-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    if (newProject.title && newProject.url) {
                      setProjects([...projects, { ...newProject, id: Date.now() }]);
                      setNewProject({ title: "", description: "", url: "" });
                      setIsDialogOpen(false); // Close dialog on successful add
                    }
                  }}
                >
                  添加项目
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Social Contact Information */}
        <div
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-green-600 dark:text-green-400">
            联系我
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://github.com/your-github-username"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-xl transition duration-300 flex items-center gap-2 backdrop-blur-sm backdrop-saturate-125"
            >
              <FaGithub className="w-5 h-5" />
              GitHub
            </a>
            <a
              href="mailto:your-email@example.com"
              className="bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-xl transition duration-300 flex items-center gap-2 backdrop-blur-sm backdrop-saturate-125"
            >
              <MdEmail className="w-5 h-5" />
              Email
            </a>
          </div>
        </div>

        {/* Project Links */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
            我的项目
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 p-4 sm:p-6 rounded-2xl backdrop-blur-sm backdrop-saturate-125 relative group"
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm mb-4">{project.description}</p>
                </a>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>确定要删除此项目吗？</AlertDialogTitle>
                      <AlertDialogDescription>
                        此操作无法撤消。这将永久删除您的项目。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => setProjects(projects.filter(p => p.id !== project.id))}>
                        删除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
