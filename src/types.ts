export interface RemedaMethodVisitors {
  [key: string]: any;
}

export interface ESLintContext {
  settings?: {
    remeda?: {
      version?: number;
    };
  };
  ecmaFeatures?: Record<string, boolean>;
  parserOptions?: {
    ecmaVersion?: number;
  };
}
