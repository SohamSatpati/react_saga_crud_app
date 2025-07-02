import { router } from '../../router';
import UserForm from '../../components/UserForm';
import UserTable from '../../components/UserTable';
import UserDetails from '../../components/UserDetails';

describe('Router configuration', () => {
  it('should have a root route with "/" path', () => {
    const root = router.routeTree;
    expect(root).toBeDefined();
    // The root route should have children
    expect(root.children).toBeDefined();
    // The index route should be present
    const index = root.children.find((r) => r.path === '/');
    expect(index).toBeDefined();
  });
  function findRouteByFullPath(route, fullPath) {
    if (route.fullPath === fullPath) {
      return route;
    }
    if (!route.children) return undefined;
    for (const child of route.children) {
      const found = findRouteByFullPath(child, fullPath);
      if (found) return found;
    }
    return undefined;
  }

  it('should have a user details route with "/user/$id" path', () => {
    const root = router.routeTree;

    const detailRoute = findRouteByFullPath(root, '/user/$id');

    expect(detailRoute).toBeDefined();
    expect(detailRoute.options?.component || detailRoute.component).toBe(
      UserDetails
    );
  });

  // it('should have a user details route with "/user/$id" path', () => {
  //   const root = router.routeTree;

  //   // Find the "/user" route first
  //   const userRoute = root.children.find(
  //     (r) => r.path === 'user' || r.options?.path === 'user'
  //   );

  //   expect(userRoute).toBeDefined();

  //   // Then check for the "$id" child route inside it
  //   const detailRoute = userRoute.children.find(
  //     (r) => r.path === '$id' || r.options?.path === '$id'
  //   );

  //   expect(detailRoute).toBeDefined();
  //   expect(detailRoute.options?.component || detailRoute.component).toBe(
  //     UserDetails
  //   );
  // });

  it('should have a notFoundComponent', () => {
    expect(router.options.notFoundComponent).toBeDefined();
  });

  it('index route should render UserForm and UserTable', () => {
    const root = router.routeTree;
    const index = root.children.find((r) => r.path === '/');
    // Use the component directly (do not call as function)
    const tree = index.options.component();
    expect(tree).toBeDefined();
    // Check for UserForm and UserTable in children
    const children = tree.props.children;
    const hasUserForm = Array.isArray(children)
      ? children.some((child) => child && child.type === UserForm)
      : children && children.type === UserForm;
    const hasUserTable = Array.isArray(children)
      ? children.some((child) => child && child.type === UserTable)
      : children && children.type === UserTable;
    expect(hasUserForm).toBe(true);
    expect(hasUserTable).toBe(true);
  });
});
