export interface Lesson {
  id: string
  title: string
  number: string
}

export interface Module {
  id: string
  title: string
  objective: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  contentDir: string
  title: string
  subtitle: string
  level: string
  description: string
  image: string
  modules: Module[]
}

export interface ProgressEntry {
  completedAt: string
}

export interface QuizResult {
  correct: number
  total: number
  completedAt: string
}

export interface ProgressData {
  [courseId: string]: {
    [key: string]: ProgressEntry
  }
}

export interface QuizData {
  [key: string]: QuizResult
}

export interface FlatLesson {
  courseId: string
  moduleId: string
  moduleTitle: string
  lessonId: string
  lessonTitle: string
  lessonNumber: string
}

export interface AdjacentLessons {
  prev: FlatLesson | null
  next: FlatLesson | null
  currentIndex: number
  total: number
}

export interface QuizOption {
  letter: string
  text: string
}

export interface QuizQuestion {
  number: number
  text: string
  options: QuizOption[]
  correctAnswer: string
}
