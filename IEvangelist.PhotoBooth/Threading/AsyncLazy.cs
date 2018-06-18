using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace IEvangelist.PhotoBooth.Threading
{
    public sealed class AsyncLazy<T>
    {
        private readonly object _mutex = new object();
        private readonly Func<Task<T>> _factory;
        private Lazy<Task<T>> _instance;

        public Task<T> Value
        {
            get
            {
                lock (_mutex)
                {
                    return _instance.Value;
                }
            }
        }

        public AsyncLazy(Func<Task<T>> factory)
        {
            _factory = ResetOnFailure(factory);
            Reset();
        }

        public void Reset()
        {
            lock (_mutex)
            {
                _instance = new Lazy<Task<T>>(_factory);
            }
        }

        private Func<Task<T>> ResetOnFailure(Func<Task<T>> factory)
            => async () =>
               {
                   try
                   {
                       return await factory().ConfigureAwait(false);
                   }
                   catch
                   {
                       Reset();
                       throw;
                   }
               };

        /// <summary>
        /// Asynchronous infrastructure support. This method permits instances of <see cref="AsyncLazy&lt;T&gt;"/> to be await'ed.
        /// </summary>
        [EditorBrowsable(EditorBrowsableState.Never)]
        public TaskAwaiter<T> GetAwaiter()
            => Value.GetAwaiter();

        /// <summary>
        /// Asynchronous infrastructure support. This method permits instances of <see cref="AsyncLazy&lt;T&gt;"/> to be await'ed.
        /// </summary>
        [EditorBrowsable(EditorBrowsableState.Never)]
        public ConfiguredTaskAwaitable<T> ConfigureAwait(bool continueOnCapturedContext)
            => Value.ConfigureAwait(continueOnCapturedContext);
    }
}