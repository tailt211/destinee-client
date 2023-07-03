import { destineeApi } from '../../https';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { PaginationRESP } from '../../model/pagination.response';
import { PostOverallDTO } from '../../model/post/dto/post-overall.dto';
import { convertRESPtoOverallDTO } from '../../model/post/post.helper';
import { PostCreateRESP } from '../../model/post/response/post-create.response';
import { PostOverallRESP } from '../../model/post/response/post-overall.response';

export const uploadPost = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const { data } = await destineeApi.post<PostCreateRESP>(`/posts`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return convertRESPtoOverallDTO(data);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải bài viết');
    }
};

export const fetchMyPosts = async (page: number = 1, limit: number = 15) => {
    try {
        const { data } = await destineeApi.get<PaginationRESP<PostOverallRESP>>(`/posts`, {
            params: { page, limit },
        });
        return {
            posts: data.results.map(convertRESPtoOverallDTO),
            page: data.page,
        } as { posts: PostOverallDTO[]; page: number };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải danh sách bài viết');
    }
};

export const archivePost = async (id: string) => {
    try {
        await destineeApi.post<void>(`/posts/${id}/archive`);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi lưu trữ bài viết');
    }
};

export const unarchivePost = async (id: string) => {
    try {
        await destineeApi.post<void>(`/posts/${id}/unarchive`);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi gỡ lưu trữ bài viết');
    }
};

export const viewPost = async (id: string) => {
    try {
        await destineeApi.post<void>(`/posts/${id}/view`);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi xem bài viết');
    }
};
