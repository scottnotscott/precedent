// prisma.js
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: [
        {
          emit: "event",
          level: "query",
        },
      ]
    });
    
  }
  prisma = global.prisma;
  prisma.$use(async (params, next) => {
    const before = Date.now()
  
    const result = await next(params)
  
    const after = Date.now()
  
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
  
    return result
  })
}

export default prisma;
