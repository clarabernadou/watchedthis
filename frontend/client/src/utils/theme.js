import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setColorBtn, setEvent } from '../redux/reducers/eventReducer';
import isThemeActive from '../Themes/isThemeActive';

export function useTheme() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isThemeActive(10, 30, 11, 1)) {
      dispatch(setEvent('Halloween'));
      dispatch(setColorBtn('halloweenColor'));
    } else if (isThemeActive(10, 1, 10, 30)) {
      dispatch(setEvent('PinkOctober'));
      dispatch(setColorBtn('pinkOctoberColor'));
    } else if (isThemeActive(12, 1, 12, 31)) {
      dispatch(setEvent('Christmas'));
      dispatch(setColorBtn('christmasColor'));
    }
  }, [dispatch]);
}
