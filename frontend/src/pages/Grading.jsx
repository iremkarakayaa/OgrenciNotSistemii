import { useState, useEffect } from 'react';
import { getLessons, getAllGrades, getStudents, updateGrade } from '../services/api';
import { showSuccess, showError } from '../utils/alerts';

function Grading() {
  const [lessons, setLessons] = useState([]);
  const [allGrades, setAllGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonStudents, setLessonStudents] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lessonsRes, gradesRes, studentsRes] = await Promise.all([
        getLessons(),
        getAllGrades(),
        getStudents()
      ]);
      setLessons(lessonsRes.data);
      setAllGrades(gradesRes.data);
      setStudents(studentsRes.data);
      setError(null);
    } catch (err) {
      setError('Veri yüklenirken hata oluştu: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGrading = (lesson) => {
    setSelectedLesson(lesson);
    setModalLoading(true);
    setShowGradingModal(true);

    const filteredGrades = allGrades.filter(grade => grade.lessonId === lesson.id);
    
    const studentsWithScores = filteredGrades.map(grade => {
      const student = students.find(s => s.id === grade.studentId);
      return {
        ...grade,
        student: student || null,
        editableScore: grade.examScore !== null && grade.examScore !== undefined ? grade.examScore : ''
      };
    });

    setLessonStudents(studentsWithScores);
    setModalLoading(false);
  };

  const handleScoreChange = (gradeId, value) => {
    setLessonStudents(prev => 
      prev.map(student => 
        student.id === gradeId 
          ? { ...student, editableScore: value }
          : student
      )
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const updatePromises = lessonStudents.map(student => {
        const scoreValue = student.editableScore === '' || student.editableScore === null 
          ? null 
          : parseFloat(student.editableScore);

        const gradeData = {
          id: student.id,
          studentId: student.studentId,
          lessonId: student.lessonId,
          examScore: scoreValue
        };

        return updateGrade(gradeData);
      });

      await Promise.all(updatePromises);
      showSuccess('Notlar başarıyla kaydedildi!');
      setShowGradingModal(false);
      
      await fetchData();
    } catch (err) {
      showError(err.message);
      console.error(err);
    } finally {
      setSaving(false);
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
          <h2>Notlandırma</h2>
          <p className="text-muted">Derslere göre öğrenci notlarını girin</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        {lessons.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              Henüz ders bulunmamaktadır.
            </div>
          </div>
        ) : (
          lessons.map((lesson) => {
            const lessonGradeCount = allGrades.filter(g => g.lessonId === lesson.id).length;
            
            return (
              <div key={lesson.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{lesson.name}</h5>
                    <p className="card-text text-muted">
                      <small>Ders Kodu: {lesson.code}</small>
                    </p>
                    <p className="card-text">
                      <span className="badge bg-info">
                        {lessonGradeCount} Kayıtlı Öğrenci
                      </span>
                    </p>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleOpenGrading(lesson)}
                      disabled={lessonGradeCount === 0}
                    >
                      <i className="bi bi-pencil-square"></i> Not Gir
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Grading Modal */}
      {showGradingModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  Not Gir - {selectedLesson?.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowGradingModal(false)}
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
                    {lessonStudents.length === 0 ? (
                      <div className="alert alert-info">
                        Bu derse henüz öğrenci atanmamış.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Öğrenci No</th>
                              <th>Ad Soyad</th>
                              <th style={{ width: '150px' }}>Not (0-100)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lessonStudents.map((grade) => (
                              <tr key={grade.id}>
                                <td>{grade.student?.studentNumber || '-'}</td>
                                <td>
                                  {grade.student?.name || ''} {grade.student?.surname || ''}
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={grade.editableScore}
                                    onChange={(e) => handleScoreChange(grade.id, e.target.value)}
                                    placeholder="Not giriniz"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowGradingModal(false)}
                  disabled={saving}
                >
                  İptal
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={handleSaveAll}
                  disabled={saving || lessonStudents.length === 0}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i> Tümünü Kaydet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Grading;
