import { useState, useEffect } from 'react';
import { getLessons, createLesson, updateLesson, deleteLesson, getAllGrades, deleteGrade } from '../services/api';
import { showSuccess, showError, showWarning, showConfirm } from '../utils/alerts';

function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: 0,
    name: '',
    code: ''
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await getLessons();
      setLessons(response.data);
      setError(null);
    } catch (err) {
      setError('Dersler yüklenirken hata oluştu: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code) {
      showWarning('Lütfen tüm alanları doldurun!');
      return;
    }

    setSubmitting(true);
    try {
      await createLesson(formData);
      showSuccess('Ders başarıyla eklendi!');
      setFormData({ name: '', code: '' });
      setShowAddForm(false);
      fetchLessons();
    } catch (err) {
      showError(err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowEdit = (lesson) => {
    setSelectedLesson(lesson);
    setEditFormData({
      id: lesson.id,
      name: lesson.name,
      code: lesson.code
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

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    
    if (!editFormData.name || !editFormData.code) {
      showWarning('Lütfen tüm alanları doldurun!');
      return;
    }

    setModalLoading(true);
    try {
      await updateLesson(editFormData);
      showSuccess('Ders başarıyla güncellendi!');
      setShowEditModal(false);
      fetchLessons();
    } catch (err) {
      showError(err.message);
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteLesson = async () => {
    const confirmDelete = await showConfirm(
      'Dersi Sil?',
      `${selectedLesson.name} (${selectedLesson.code}) dersini silmek istediğinize emin misiniz? Bu derse ait tüm notlar da silinecektir!`
    );
    
    if (!confirmDelete) return;

    setModalLoading(true);
    try {
      const allGradesRes = await getAllGrades();
      const lessonGrades = allGradesRes.data.filter(g => g.lessonId === selectedLesson.id);
      
      if (lessonGrades.length > 0) {
        await Promise.all(lessonGrades.map(grade => deleteGrade(grade.id)));
      }
      
      await deleteLesson(selectedLesson.id);
      
      showSuccess('Ders ve tüm notları başarıyla silindi!');
      setShowEditModal(false);
      fetchLessons();
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
          <h2>Ders İşlemleri</h2>
          <p className="text-muted">Dersleri görüntüleyin ve yeni ders ekleyin</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-success"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <i className="bi bi-plus-circle"></i> Yeni Ders Ekle
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Add Lesson Form */}
      {showAddForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Yeni Ders Ekle</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-5">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Ders Adı</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Örn: Matematik"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">Ders Kodu</label>
                    <input
                      type="text"
                      className="form-control"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Örn: MAT101"
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

      {/* Lessons Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Ders Adı</th>
                  <th>Ders Kodu</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {lessons.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      Henüz ders bulunmamaktadır.
                    </td>
                  </tr>
                ) : (
                  lessons.map((lesson) => (
                    <tr key={lesson.id}>
                      <td>{lesson.name}</td>
                      <td>
                        <span className="badge bg-primary">{lesson.code}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleShowEdit(lesson)}
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

      {/* Edit Lesson Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  Dersi Düzenle
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateLesson}>
                  <div className="mb-3">
                    <label htmlFor="edit-name" className="form-label">Ders Adı</label>
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
                    <label htmlFor="edit-code" className="form-label">Ders Kodu</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-code"
                      name="code"
                      value={editFormData.code}
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
                  onClick={handleDeleteLesson}
                  disabled={modalLoading}
                >
                  <i className="bi bi-trash"></i> Dersi Sil
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
                    onClick={handleUpdateLesson}
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

export default Lessons;
