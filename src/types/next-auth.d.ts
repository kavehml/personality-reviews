import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    cohortId?: string;
    cohortName?: string;
    quizCompleted?: boolean;
    role?: "USER" | "ADMIN";
  }

  interface Session {
    user: User & {
      id: string;
      cohortId?: string;
      cohortName?: string;
      quizCompleted?: boolean;
      role?: "USER" | "ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    cohortId?: string;
    cohortName?: string;
    quizCompleted?: boolean;
    role?: "USER" | "ADMIN";
  }
}
