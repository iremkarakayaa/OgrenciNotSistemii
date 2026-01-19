using Core.Entities;
using DataAccessLayer.Abstract;
using DataAccessLayer.Concrete;
using Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace DataAccessLayer.Concrete
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        private readonly DbSet<T> _object;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _object = _context.Set<T>();
        }

        public void Delete(T t)
        {
            if (t is BaseEntity entity)
            {
                entity.DeletedAt = DateTime.UtcNow;
                _context.Update(t);
            }
            else
            {
                _object.Remove(t);
            }

            _context.SaveChanges();
        }

        public List<T> GetAll()
        {
            return _object.ToList();
        }

        public T GetById(int id)
        {
            return _object.Find(id);
        }

        public void Insert(T t)
        {
            if (t is BaseEntity entity)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }
            _object.Add(t);
            _context.SaveChanges();
        }

        public void Update(T t)
        {
            if (t is BaseEntity entity)
            {
                entity.UpdatedAt = DateTime.UtcNow;
            }
            _object.Update(t);
            _context.SaveChanges();
        }
        
        public List<T> GetListAll(Expression<Func<T, bool>> filter = null)
        {
            return filter == null
                ? _context.Set<T>().ToList()
                : _context.Set<T>().Where(filter).ToList();
        }
    }
}
