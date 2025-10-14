import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  await prisma.user.create({
    data: {
      nickname: "admin",
      email: "admin@example.com",
      password: "1224532",// temp 비밀번호
      image: "https://i.pravatar.cc/150?img=1",// temp 이미지
      /*
      comments:{
       connect:{
          id :comment.id
        }
      },
      members : {
        connect:{
          id :members.id
        }
      }
      */
    },
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
    });
    await prisma.comment.create({
      data:{
        content: "첫 번째 댓글입니다.",
      },
    })
    await prisma.member.create({
      data: {
        role: "participant",
        status:"accepted",
        },
    })
    await prisma.task.create({
      data: {
          create: [{ title: "첫 번째 작업", description: "첫 번째 작업 설명", status: "todo"}],
          },
    })
    await prisma.project.create({
      data: {
          create:{ title: "첫 번째 프로젝트", description: "첫 번째 프로젝트 설명" }
      },
    })
  console.log("✅ 시드 완료");
}

seed();
