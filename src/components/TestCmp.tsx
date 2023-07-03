import { FC } from 'react';

const TestCmp: FC = () => {
	return (
		<div className='mt-3 border-2 py-5 text-center'>
			<h2 className='text-lg font-bold'>This is test component</h2>
			<p className='mt-2 text-sm'>Only render when you are on nested route /test/:id</p>
		</div>
	);
};

export default TestCmp;
