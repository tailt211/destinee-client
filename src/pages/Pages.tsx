import { FC, Fragment } from 'react';
import { Route } from 'react-router';
import { RoutePage } from '../router/pages';

const Pages: FC<{ pages: RoutePage[] }> = ({ pages }) => {
	return (
		<Fragment>
			{pages.map((page, index) => {
				return (
					<Route key={index} exact={page.exact} path={`/${page.path}`} component={page.component} />
				);
			})}
		</Fragment>
	);
};

export default Pages;
