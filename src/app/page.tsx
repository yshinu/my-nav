"use client"; // This is important for Framer Motion to work in Next.js App Router

import Link from "next/link";
import { useTheme } from "next-themes";
import { FaPlus } from "react-icons/fa";
import FlowingBackground from "@/components/ui/flowing-background";
import { Trash2, Pencil } from "lucide-react"; // Import Trash2 and Pencil icons
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { toast } from "sonner"; // For notifications
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
 
 interface Project {
   id: number;
   title: string;
   description: string;
   url: string;
 }
 
 export default function Home() {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
   const [projects, setProjects] = useState<Project[]>([]);
   const [newProject, setNewProject] = useState<Omit<Project, "id">>({ title: "", description: "", url: "" });
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
   const [currentProject, setCurrentProject] = useState<Project | null>(null);
   const [adminSecret, setAdminSecret] = useState("");
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [isAdminAuthDialogOpen, setIsAdminAuthDialogOpen] = useState(false); // New state for admin auth dialog
   const [isLoading, setIsLoading] = useState(true); // New state for loading indicator

   const handleAuthenticate = async () => {
     const res = await fetch("/api/projects/authenticate", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ secret: adminSecret }),
     });

     if (res.ok) {
       setIsAuthenticated(true);
       toast.success("密钥验证成功！");
       // Close the dialog on successful authentication
       setIsAdminAuthDialogOpen(false);
     } else {
       setIsAuthenticated(false);
       toast.error("密钥验证失败。");
     }
   };

  useEffect(() => {
    setMounted(true);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Failed to load projects.");
    } finally {
      setIsLoading(false); // Set loading to false when fetching completes (success or failure)
    }
  };

  const addProject = async () => {
    if (!newProject.title || !newProject.url) {
      toast.error("项目名称和链接是必填项。");
      return;
    }
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Secret": adminSecret,
        },
        body: JSON.stringify(newProject),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const addedProject: Project = await res.json();
      setProjects((prevProjects) => [...prevProjects, addedProject]);
      setNewProject({ title: "", description: "", url: "" });
      setIsDialogOpen(false);
      toast.success("项目添加成功！");
    } catch (error) {
      console.error("Failed to add project:", error);
      toast.error("添加项目失败。");
    }
  };
 
   const deleteProject = async (id: number) => {
     try {
       const res = await fetch(`/api/projects/${id}`, {
         method: "DELETE",
         headers: {
           "X-Admin-Secret": adminSecret,
         },
       });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setProjects((prevProjects) => prevProjects.filter((p) => p.id !== id));
      toast.success("项目删除成功！");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("删除项目失败。");
    }
  };

  const updateProject = async () => {
    if (!currentProject?.title || !currentProject?.url) {
      toast.error("项目名称和链接是必填项。");
      return;
    }
    try {
      const res = await fetch(`/api/projects/${currentProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Secret": adminSecret,
        },
        body: JSON.stringify(currentProject),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const updatedProject: Project = await res.json();
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
      setIsEditDialogOpen(false);
      setCurrentProject(null);
      toast.success("项目更新成功！");
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("更新项目失败。");
    }
  };

  if (!mounted) {
    return null;
  }
  return (
    <div className="relative min-h-screen text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <FlowingBackground />
      <div
        className="bg-white/60 dark:bg-gray-800/60 shadow-2xl rounded-3xl backdrop-blur-xl backdrop-saturate-150 p-6 sm:p-10 md:p-12 max-w-5xl w-full text-center relative border border-gray-200 dark:border-gray-700"
      >
        <div className="absolute top-6 right-6 flex space-x-4">
          <Dialog open={isAdminAuthDialogOpen} onOpenChange={setIsAdminAuthDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-36 h-10 bg-gray-100/70 dark:bg-gray-700/70 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-full transition duration-300 shadow-md flex items-center justify-center">
                管理员登录
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">管理员登录</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300">
                  请输入管理员密钥进行验证。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="admin-secret" className="text-right text-gray-700 dark:text-gray-200">
                    管理员密钥
                  </Label>
                  <Input
                    id="admin-secret"
                    type="password"
                    placeholder="输入管理员密钥"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    className="col-span-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAuthenticate} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                  验证
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => {
              console.log(theme)
              setTheme(theme === "dark" ? "light" : "dark")
            }}
            className="w-36 h-10 bg-gray-100/70 dark:bg-gray-700/70 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-full transition duration-300 shadow-md flex items-center justify-center"
          >
            切换主题 ({theme === "dark" ? "深色" : "浅色"})
          </Button>
        </div>
        {/* Project Creation with Dialog */}
        <div className="mb-16 w-full max-w-3xl mx-auto">
          {isAuthenticated && (
            <h2 className="text-4xl font-bold mb-8 text-teal-600 dark:text-teal-400">新增项目</h2>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              {isAuthenticated && (
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 text-lg w-full justify-center shadow-lg transition duration-300">
                  <FaPlus className="w-6 h-6" />
                  添加新项目
                </Button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">新增项目</DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300">
                  填写项目信息，点击添加完成。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right text-gray-700 dark:text-gray-200">
                    项目名称
                  </Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, title: e.target.value })}
                    className="col-span-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right text-gray-700 dark:text-gray-200">
                    项目描述
                  </Label>
                  <Input
                    id="description"
                    value={newProject.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, description: e.target.value })}
                    className="col-span-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right text-gray-700 dark:text-gray-200">
                    项目链接
                  </Label>
                  <Input
                    id="url"
                    value={newProject.url}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, url: e.target.value })}
                    className="col-span-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={addProject}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  添加项目
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Social Contact Information */}
        <div
          className="mb-16"
        >
          <h2 className="text-4xl font-bold mb-8 text-teal-600 dark:text-teal-400">
            联系我
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="https://github.com/your-github-username"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100/70 dark:bg-gray-700/70 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl transition duration-300 flex items-center gap-3 shadow-md"
            >
              <FaGithub className="w-6 h-6" />
              GitHub
            </a>
            <a
              href="mailto:your-email@example.com"
              className="bg-gray-100/70 dark:bg-gray-700/70 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl transition duration-300 flex items-center gap-3 shadow-md"
            >
              <MdEmail className="w-6 h-6" />
              Email
            </a>
          </div>
        </div>

        {/* Project Links */}
        <div>
          <h2 className="text-4xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">
            我的项目
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Skeleton Loader
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-lg relative border border-gray-200 dark:border-gray-700 flex flex-col justify-between animate-pulse"
                >
                  <div className="block flex-grow">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                  </div>
                </div>
              ))
            ) : projects.length === 0 ? (
              // No projects message
              <p className="text-gray-600 dark:text-gray-300 text-lg col-span-full">暂无项目。</p>
            ) : (
              // Actual project list
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative group border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block flex-grow"
                  >
                    <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100 leading-snug">{project.title}</h3>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{project.description || "暂无描述。"}</p>
                  </a>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {isAuthenticated && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">确定要删除此项目吗？</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                          此操作无法撤消。这将永久删除您的项目。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300">取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteProject(project.id)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                          删除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-500 hover:text-blue-600"
                      onClick={() => {
                        setCurrentProject(project);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">编辑项目</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              修改项目信息，点击保存完成。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right text-gray-700 dark:text-gray-200">
                项目名称
              </Label>
              <Input
                id="edit-title"
                value={currentProject?.title || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentProject((prev) => ({ ...prev!, title: e.target.value }))
                }
                className="col-span-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right text-gray-700 dark:text-gray-200">
                项目描述
              </Label>
              <Input
                id="edit-description"
                value={currentProject?.description || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentProject((prev) => ({ ...prev!, description: e.target.value }))
                }
                className="col-span-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-url" className="text-right text-gray-700 dark:text-gray-200">
                项目链接
              </Label>
              <Input
                id="edit-url"
                value={currentProject?.url || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCurrentProject((prev) => ({ ...prev!, url: e.target.value }))
                }
                className="col-span-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={updateProject} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
