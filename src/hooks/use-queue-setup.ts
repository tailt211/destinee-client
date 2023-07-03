import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldSection, QueueSetupFields } from '../components/info-setting/field-section/field-section.type';
import { fieldSectionQueueSetup } from '../components/info-setting/field-section/field-sections';
import { AppDispatch, RootState } from '../store';
import { QueueState } from '../store/queue/queue.slice';

export default function useQueueSetup() {
    const dispatch: AppDispatch = useDispatch();
    const { filter } = useSelector((state: RootState) => state.queue) as QueueState;

    /* Field Section */
    const queueSetupFieldSection = useMemo(
        () => fieldSectionQueueSetup(dispatch, filter!),
        [filter, dispatch],
    );

    const fieldList: FieldSection<QueueSetupFields>[] = useMemo(() => {
        return [queueSetupFieldSection];
    }, [queueSetupFieldSection]);

    return { fieldList };
}
