import axios from "axios";

const API_URL = "http://localhost:5000/api/courses";

export const getCourses = async () => axios.get(API_URL);
export const getCourse = async (id: number) => axios.get(`${API_URL}/${id}`);
export const addCourse = async (course: any) => axios.post(API_URL, course);
export const updateCourse = async (id: number, course: any) =>
  axios.put(`${API_URL}/${id}`, course);
export const deleteCourse = async (id: number) =>
  axios.delete(`${API_URL}/${id}`);
