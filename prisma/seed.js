import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  await prisma.member.deleteMany()
  await prisma.project.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.user.deleteMany()
   await prisma.task.deleteMany()
  await prisma.subtask.deleteMany()
  
  const user = await prisma.user.create({
    data: {
      nickname: "admin",
      email: "admin@example.com",
      password: "1224532",// temp 비밀번호
      profileImage: "https://i.pravatar.cc/150?img=1",// temp 이미지
    }
})
  const project = await prisma.project.create({
      data:{name: "첫 번째 프로젝트", description: "첫 번째 프로젝트 설명"}
  })
  const member = await prisma.member.create({
      data: {
        role: "participant",
        status:"accepted",
        joinedAt:"2025-10-01",
        users: { connect: { id: user.id } },
        projects:{connect: { id: project.id } }
        },
    })
   const comment = await prisma.comment.create({
      data:{
        content: "첫 번째 댓글입니다.",
        users: { connect: { id: user.id } },
        tasks: { connect: { id: task.id } }
      },
    })
    const task = await prisma.task.create({
      data: {
           title: "첫 번째 작업", content: "첫 번째 작업 설명", status: "todo",projects:{connect: { id: project.id } }, member_id:member.id
          },
    })
    await prisma.subtask.create({
      data:
        { title: "첫번째 하위 작업", is_completed :false, tasks: { connect: { id: task.id } }}
      
    })
  
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
    };
  console.log("✅ 시드 완료");
seed();
