export interface Application {
    id: number;
    institution: {
        name: string,
        tag: string,
    };
    website: string;
    scholarship: boolean;
    status: string;
    deadline: string;
  }