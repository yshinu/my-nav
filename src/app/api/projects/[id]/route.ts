import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SECRET_KEY } from '@/config/secret';

const projectsFilePath = path.join(process.cwd(), 'config', 'projects.json');

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const adminSecret = req.headers.get('X-Admin-Secret');
  if (!adminSecret || adminSecret !== ADMIN_SECRET_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const idToDelete = parseInt(params.id, 10);
    const fileContents = await fs.readFile(projectsFilePath, 'utf8');
    let projects = JSON.parse(fileContents);

    const initialLength = projects.length;
    projects = projects.filter((p: any) => p.id !== idToDelete);

    if (projects.length === initialLength) {
      return NextResponse.json({ message: 'Project not found.' }, { status: 404 });
    }

    await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), 'utf8');
    return NextResponse.json({ message: 'Project deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ message: 'Failed to delete project.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const adminSecret = req.headers.get('X-Admin-Secret');
  if (!adminSecret || adminSecret !== ADMIN_SECRET_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const idToUpdate = parseInt(params.id, 10);
    const updatedProjectData = await req.json();
    const fileContents = await fs.readFile(projectsFilePath, 'utf8');
    let projects = JSON.parse(fileContents);

    const projectIndex = projects.findIndex((p: any) => p.id === idToUpdate);

    if (projectIndex === -1) {
      return NextResponse.json({ message: 'Project not found.' }, { status: 404 });
    }

    projects[projectIndex] = { ...projects[projectIndex], ...updatedProjectData };

    await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), 'utf8');
    return NextResponse.json(projects[projectIndex], { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ message: 'Failed to update project.' }, { status: 500 });
  }
}