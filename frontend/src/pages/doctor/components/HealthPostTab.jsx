const HealthPostTab = ({ posts, newPost, setNewPost, onCreatePost, onDeletePost }) => {
    return (
        <div className="row g-4">
            {/* Create Health Post Form */}
            <div className="col-lg-5">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                    <h5 className="fw-bold mb-4 text-dark border-bottom pb-2">Publish New Health Post</h5>
                    <form onSubmit={onCreatePost}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary small">POST TITLE</label>
                            <input type="text" className="form-control rounded-pill px-3" placeholder="Enter post title" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary small">CATEGORY</label>
                            <select className="form-select rounded-pill px-3" value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })} required>
                                <option value="Wellness">Wellness</option>
                                <option value="Mental Health">Mental Health</option>
                                <option value="Nutrition">Nutrition</option>
                                <option value="General">General</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary small">IMAGE URL (OPTIONAL)</label>
                            <input type="text" className="form-control rounded-pill px-3" placeholder="https://unsplash.com/..." value={newPost.image_url} onChange={e => setNewPost({ ...newPost, image_url: e.target.value })} />
                            <div className="form-text text-muted small px-2">Leave blank to use category default illustration.</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary small">POST CONTENT</label>
                            <textarea className="form-control rounded-4 p-3" rows="5" placeholder="Write post information here..." value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill px-4 w-100 shadow-sm">Publish Post</button>
                    </form>
                </div>
            </div>

            {/* Existing Health Posts */}
            <div className="col-lg-7">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                    <h5 className="fw-bold mb-4 text-dark border-bottom pb-2">Existing Health Posts</h5>
                    {posts.length > 0 ? (
                        <div className="list-group list-group-flush">
                            {posts.map(post => (
                                <div key={post.post_id} className="list-group-item p-3 mb-3 border-0 bg-light rounded-4 d-flex justify-content-between align-items-center hover-grow">
                                    <div>
                                        <h6 className="fw-bold text-primary mb-1">{post.title}</h6>
                                        <span className="badge bg-secondary-subtle text-secondary rounded-pill me-2 px-2 small">{post.category || 'Wellness'}</span>
                                        <small className="text-muted">By {post.author_name} | {new Date(post.created_at).toLocaleDateString()}</small>
                                    </div>
                                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onDeletePost(post.post_id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-journal-medical display-6"></i>
                            <p className="mt-2 mb-0">No health posts found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HealthPostTab;
