import Image from "next/image";
import type { Project } from "@/data/projects";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article data-project-card className="group">
      <div className="overflow-hidden rounded-2xl bg-[#17263B] transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ objectPosition: project.position ?? "50% 50%" }}
          />
          <div className="absolute left-3 top-3 rounded-full bg-[#17263B]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur">
            {project.category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-[15px] font-bold tracking-tight text-ink">
            {project.title}
          </h3>
          <p className="mt-1 text-[13px] leading-[1.5] text-slate">
            {project.description}
          </p>
        </div>
      </div>
    </article>
  );
}