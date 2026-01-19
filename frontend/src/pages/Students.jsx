import { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent, getLessons, getGradesByStudentId, createGrade, getAllGrades, deleteGrade } from '../services/api';
import { showSuccess, showError, showWarning, showConfirm } from '../utils/alerts';

function Students() {
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    surname: '',
    studentNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showEnrolledModal, setShowEnrolledModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [enrolledLessons, setEnrolledLessons] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: 0,
    name: '',
    surname: '',
    studentNumber: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, lessonsRes] = await Promise.all([
        getStudents(),
        getLessons()
      ]);
      setStudents(studentsRes.data);
      setLessons(lessonsRes.data);
      setError(null);
    } catch (err) {
      setError('Veri yüklenirken hata oluştu: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle student form input change
  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData({
      ...studentFormData,
      [name]: value
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    if (!studentFormData.name || !studentFormData.surname || !studentFormData.studentNumber) {
      showWarning('Lütfen tüm alanları doldurun!');
      return;
    }

    setSubmitting(true);
    try {
      await createStudent(studentFormData);
      showSuccess('Öğrenci başarıyla eklendi!');
      setStudentFormData({ name: '', surname: '', studentNumber: '' });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      showError(err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      id: student.id,
      name: student.name,
      surname: student.surname,
      studentNumber: student.studentNumber
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    
    if (!editFormData.name || !editFormData.surname || !editFormData.studentNumber) {
      showWarning('Lütfen tüm alanları doldurun!');
      return;
    }

    setModalLoading(true);
    try {
      await updateStudent(editFormData);
      showSuccess('Öğrenci başarıyla güncellendi!');
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      showError(err.message);
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    const confirmDelete = await showConfirm(
      'Öğrenciyi Sil?',
      `${selectedStudent.name} ${selectedStudent.surname} adlı öğrenciyi silmek istediğinize emin misiniz? Bu öğrencinin tüm notları da silinecektir!`
    );
    
    if (!confirmDelete) return;

    setModalLoading(true);
    try {
      const allGradesRes = await getAllGrades();
      const studentGrades = allGradesRes.data.filter(g => g.studentId === selectedStudent.id);
      
      if (studentGrades.length > 0) {
        await Promise.all(studentGrades.map(grade => deleteGrade(grade.id)));
      }
      
      await deleteStudent(selectedStudent.id);
      
      showSuccess('Öğrenci ve tüm notları başarıyla silindi!');
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      showError(err.message);
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleShowEnrolled = async (student) => {
    setSelectedStudent(student);
    setShowEnrolledModal(true);
    setModalLoading(true);
    
    try {
      const response = await getGradesByStudentId(student.id);
      setEnrolledLessons(response.data);
    } catch (err) {
      console.error('Dersler yüklenirken hata:', err);
      setEnrolledLessons([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleShowAssign = (student) => {
    setSelectedStudent(student);
    setSelectedLessons([]);
    setShowAssignModal(true);
  };

  const handleLessonToggle = (lessonId) => {
    setSelectedLessons(prev => {
      if (prev.includes(lessonId)) {
        return prev.filter(id => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  const handleAssignLessons = async () => {
    if (selectedLessons.length === 0) {
      showWarning('Lütfen en az bir ders seçin!');
      return;
    }

    setModalLoading(true);
    try {
      const promises = selectedLessons.map(lessonId => 
        createGrade({
          studentId: selectedStudent.id,
          lessonId: lessonId,
          examScore: null
        })
      );

      await Promise.all(promises);
      showSuccess(`${selectedLessons.length} ders başarıyla atandı!`);
      setShowAssignModal(false);
      setSelectedLessons([]);
    } catch (err) {
      showError(err.message);
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteEnrolledLesson = async (grade) => {
    const confirmDelete = await showConfirm(
      'Dersi Kaldır?',
      `${grade.lesson?.name || 'Bu dersi'} ${selectedStudent?.name} ${selectedStudent?.surname} adlı öğrenciden kaldırmak istediğinize emin misiniz?`
    );
    
    if (!confirmDelete) return;

    setModalLoading(true);
    try {
      await deleteGrade(grade.id);
      showSuccess('Ders başarıyla kaldırıldı!');
      const response = await getGradesByStudentId(selectedStudent.id);
      setEnrolledLessons(response.data);
    } catch (err) {
      showError(err.message);
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h2>Öğrenci İşlemleri</h2>
          <p className="text-muted">Öğrencileri görüntüleyin, yeni öğrenci ekleyin ve ders atayın</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-success"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <i className="bi bi-plus-circle"></i> Yeni Öğrenci Ekle
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Add Student Form */}
      {showAddForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Yeni Öğrenci Ekle</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddStudent}>
              <div className="row">
                <div className="col-md-3">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Ad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={studentFormData.name}
                      onChange={handleStudentFormChange}
                      placeholder="Örn: İrem"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label htmlFor="surname" className="form-label">Soyad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="surname"
                      name="surname"
                      value={studentFormData.surname}
                      onChange={handleStudentFormChange}
                      placeholder="Örn: Karakaya"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="studentNumber" className="form-label">Öğrenci Numarası</label>
                    <input
                      type="text"
                      className="form-control"
                      id="studentNumber"
                      name="studentNumber"
                      value={studentFormData.studentNumber}
                      onChange={handleStudentFormChange}
                      placeholder="Örn: 12345"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <div className="mb-3 w-100">
                    <button 
                      type="submit" 
                      className="btn btn-primary w-100"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle"></i> Kaydet
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Öğrenci No</th>
                  <th>Ad</th>
                  <th>Soyad</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      Henüz öğrenci bulunmamaktadır.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.studentNumber}</td>
                      <td>{student.name}</td>
                      <td>{student.surname}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleShowEnrolled(student)}
                        >
                          <i className="bi bi-list-ul"></i> Aldığı Dersler
                        </button>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleShowAssign(student)}
                        >
                          <i className="bi bi-plus-circle"></i> Ders Ata
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleShowEdit(student)}
                        >
                          <i className="bi bi-pencil-square"></i> Düzenle
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enrolled Lessons Modal */}
      {showEnrolledModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">
                  Aldığı Dersler - {selectedStudent?.name} {selectedStudent?.surname}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowEnrolledModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {modalLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {enrolledLessons.length === 0 ? (
                      <div className="alert alert-info">
                        Bu öğrenci henüz hiçbir derse kayıtlı değil.
                      </div>
                    ) : (
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Ders Kodu</th>
                            <th>Ders Adı</th>
                            <th>Not</th>
                            <th>İşlemler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrolledLessons.map((grade, index) => (
                            <tr key={index}>
                              <td><strong>{grade.lesson?.code || '-'}</strong></td>
                              <td>{grade.lesson?.name || 'Bilinmiyor'}</td>
                              <td>
                                {grade.examScore !== null && grade.examScore !== undefined ? (
                                  <span className="badge bg-success">{grade.examScore}</span>
                                ) : (
                                  <span className="badge bg-secondary">Not Girilmedi</span>
                                )}
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteEnrolledLesson(grade)}
                                  disabled={modalLoading}
                                >
                                  <i className="bi bi-trash"></i> Sil
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowEnrolledModal(false)}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Lesson Modal */}
      {showAssignModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  Ders Ata - {selectedStudent?.name} {selectedStudent?.surname}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowAssignModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">Atamak istediğiniz dersleri seçin:</p>
                <div className="list-group">
                  {lessons.map((lesson) => (
                    <label key={lesson.id} className="list-group-item">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={selectedLessons.includes(lesson.id)}
                        onChange={() => handleLessonToggle(lesson.id)}
                      />
                      <strong>{lesson.code}</strong> - {lesson.name}
                    </label>
                  ))}
                </div>
                {lessons.length === 0 && (
                  <div className="alert alert-warning mt-3">
                    Henüz ders bulunmamaktadır.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAssignModal(false)}
                >
                  İptal
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleAssignLessons}
                  disabled={modalLoading || selectedLessons.length === 0}
                >
                  {modalLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>Kaydet ({selectedLessons.length} ders)</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  Öğrenci Bilgilerini Düzenle
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateStudent}>
                  <div className="mb-3">
                    <label htmlFor="edit-name" className="form-label">Ad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-name"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-surname" className="form-label">Soyad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-surname"
                      name="surname"
                      value={editFormData.surname}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-studentNumber" className="form-label">Öğrenci Numarası</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-studentNumber"
                      name="studentNumber"
                      value={editFormData.studentNumber}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDeleteStudent}
                  disabled={modalLoading}
                >
                  <i className="bi bi-trash"></i> Öğrenciyi Sil
                </button>
                <div>
                  <button 
                    type="button" 
                    className="btn btn-secondary me-2" 
                    onClick={() => setShowEditModal(false)}
                  >
                    İptal
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleUpdateStudent}
                    disabled={modalLoading}
                  >
                    {modalLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle"></i> Güncelle
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
