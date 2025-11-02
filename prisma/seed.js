import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();
  await prisma.project.deleteMany();
  await prisma.member.deleteMany();
  await prisma.task.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.subtask.deleteMany();

  const user = await prisma.user.create({
    data: {
      nickname: "admin",
      email: "admin@example.com",
      password: "1224532", // temp 비밀번호
      profileImage: "https://i.pravatar.cc/150?img=1", // temp 이미지
    },
  });
  const project = await prisma.project.create({
    data: { name: "첫 번째 프로젝트", description: "첫 번째 프로젝트 설명" },
  });
  const member = await prisma.member.create({
    data: {
      role: "participant",
      status: "accepted",
      joinedAt: new Date("2025-10-01"),
      users: { connect: { id: user.id } },
      projects: { connect: { id: project.id } },
    },
  });
  const task = await prisma.task.create({
    data: {
      title: "첫 번째 작업",
      content: "첫 번째 작업 설명",
      tags: {
        create: [{ name: "운동" }],
      },
      start_year: 2025,
      start_month: 12,
      start_day: 25,
      end_year: 2026,
      end_month: 1,
      end_date: 1,
      projects: { connect: { id: project.id } },
      task_status: "done",
      members: { connect: { id: member.id } },
    },
  });
  const comment = await prisma.comment.create({
    data: {
      content: "첫 번째 댓글입니다.",
      users: { connect: { id: user.id } },
      tasks: { connect: { id: task.id } },
    },
  });
  await prisma.subtask.create({
    data: {
      title: "첫번째 하위 작업",
      is_completed: false,
      tasks: { connect: { id: task.id } },
    },
  });

  /*
     members:{
        create:[
          {
            role: "participant",
            status:"accepted",
            tasks:{
              create: [{ title: "첫 번째 작업", description: "첫 번째 작업 설명", status: "todo"}],
              projects:{
                create:[{ title: "첫 번째 프로젝트", description: "첫 번째 프로젝트 설명" }]
              },
            },
          }
        ]
      }
    */
}
console.log("✅ 시드 완료");
seed();
