import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    cohortId?: string;
    cohortName?: string;
    quizCompleted?: boolean;
  }

  interface Session {
    user: User & {
      id: string;
      cohortId?: string;
      cohortName?: string;
      quizCompleted?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    cohortId?: string;
    cohortName?: string;
    quizCompleted?: boolean;
  }
}
