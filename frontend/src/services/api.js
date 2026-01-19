import axios from 'axios';

const API_BASE_URL = 'http://localhost:5044/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      let errorMessage = error.message;
      
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join(', ');
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      error.message = errorMessage;
    }
    return Promise.reject(error);
  }
);

// Students API
export const getStudents = () => api.get('/Students');
export const createStudent = (studentData) => api.post('/Students', studentData);
export const updateStudent = (studentData) => api.put('/Students', studentData);
export const deleteStudent = (id) => api.delete(`/Students/${id}`);

// Lessons API
export const getLessons = () => api.get('/Lessons');
export const createLesson = (lessonData) => api.post('/Lessons', lessonData);
export const updateLesson = (lessonData) => api.put('/Lessons', lessonData);
export const deleteLesson = (id) => api.delete(`/Lessons/${id}`);

// Grades API
export const getAllGrades = () => api.get('/Grades');
export const createGrade = (gradeData) => api.post('/Grades', gradeData);
export const updateGrade = (gradeData) => api.put('/Grades', gradeData);
export const deleteGrade = (id) => api.delete(`/Grades/${id}`);
export const getGradesByStudentId = (studentId) => api.get(`/Grades/GetByStudentId/${studentId}`);

export default api;
