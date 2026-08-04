import { useState } from 'react';
import * as healthPostService from '../services/healthPostService';
import Swal from 'sweetalert2';
import useFetch from './useFetch';

/**
 * Custom hook encapsulating health posts CRUD logic shared between
 * Admin Dashboard and Doctor Dashboard.
 */
const useHealthPosts = () => {
    const { data: posts, refetch: fetchPosts } = useFetch(healthPostService.getAll);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Wellness', image_url: '' });

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await healthPostService.create(newPost);
            setNewPost({ title: '', content: '', category: 'Wellness', image_url: '' });
            fetchPosts();
            Swal.fire('Success!', 'Post created successfully!', 'success');
        } catch (err) {
            Swal.fire('Error!', 'Failed to create post: ' + (err.response?.data?.message || 'Error'), 'error');
        }
    };

    const handleDeletePost = async (post_id) => {
        const result = await Swal.fire({
            title: 'Delete Post?',
            text: 'Are you sure you want to delete this post?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (!result.isConfirmed) return;
        try {
            await healthPostService.deletePost(post_id);
            fetchPosts();
            Swal.fire('Deleted!', 'Post deleted successfully.', 'success');
        } catch (err) {
            Swal.fire('Error!', 'Failed to delete post: ' + (err.response?.data?.message || 'Error'), 'error');
        }
    };

    return { posts, newPost, setNewPost, fetchPosts, handleCreatePost, handleDeletePost };
};

export default useHealthPosts;
