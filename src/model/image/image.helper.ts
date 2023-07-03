import boyAvatar from '../../assets/avatar-boy-1.png';
import girlAvatar from '../../assets/avatar-girl-1.png';
import { GENDER } from '../profile/profile.constant';
import { ImageDTO } from './dto/image.dto';
import { ImageRESP } from './response/image-response';
import { TYPE_IMAGE } from './type-image.enum';

export const convertImageRESPtoDTO = (data: ImageRESP) =>
    ({
        _id: data._id,
        name: data.name,
        ownerId: data.owner,
        size: data.size,
        type: TYPE_IMAGE[data.type],
        url: data.url,
        types: data.types.map((_type) => ({
            name: _type.name,
            url: _type.url,
            type: TYPE_IMAGE[_type.type],
        })),
    } as ImageDTO);

export const getImageUrl: (src: ImageDTO | undefined | null | string, type: TYPE_IMAGE, defaultSrc?: string) => string = (
    src,
    type,
    defaultSrc = 'https://www.pngmart.com/files/12/Boy-Emoji-Avatar-PNG.png',
) => {
    if (!src) return defaultSrc;
    if (typeof src === 'string') return src;
    if (type === TYPE_IMAGE.ORIGINAL) return src.url || defaultSrc;

    const foundUrl = src.types?.find((_type) => _type.type === type)?.url;
    return foundUrl || defaultSrc;
};

export const getAvatar = (src: ImageDTO | undefined | null | string, type: TYPE_IMAGE, gender: GENDER) => {
    const defaultSrc = gender === GENDER.MALE ? boyAvatar : girlAvatar;
    return getImageUrl(src, type, defaultSrc);
};
