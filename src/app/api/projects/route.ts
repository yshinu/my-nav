import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SECRET_KEY } from '../../../../config/secret';

const projectsFilePath = path.join(process.cwd(), 'config', 'projects.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(projectsFilePath, 'utf8');
    const projects = JSON.parse(fileContents);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error reading projects file:', error);
    return NextResponse.json({ message: 'Failed to load projects.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get('X-Admin-Secret');
  if (!adminSecret || adminSecret !== ADMIN_SECRET_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const newProject = await req.json();
    const fileContents = await fs.readFile(projectsFilePath, 'utf8');
    const projects = JSON.parse(fileContents);

    const newId = projects.length > 0 ? Math.max(...projects.map((p: any) => p.id)) + 1 : 1;
    const projectToAdd = { id: newId, ...newProject };
    projects.push(projectToAdd);

    await fs.writeFile(projectsFilePath, JSON.stringify(projects, null, 2), 'utf8');
    return NextResponse.json(projectToAdd, { status: 201 });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ message: 'Failed to add project.' }, { status: 500 });
  }
}