import { useEffect, useRef } from "react";

/*
 * useEffect - basically, re-run on every render
 * We do not need this, so let's fix it.
 * Based on: (Solution 5) https://atomizedobjects.com/blog/react/using-componentdidmount-in-react-hooks/
 */

export default function useDidMount(callback) {
  // useRef - The returned object will persist for the full lifetime of the component.
  const didMount = useRef(null);

  useEffect(() => {
    if (callback && !didMount.current) {
      didMount.current = true;
      callback();
    }
  });
}
