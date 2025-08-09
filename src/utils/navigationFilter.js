// utils/navigationFilter.js

/**
 * Recorre recursivamente cada nodo en `tree` y:
 *  - Si node.authority es [], se asume visible para cualquier usuario logueado.
 *  - Si node.authority tiene elementos, se comprueba que al menos uno
 *    coincida con alguno de los roles en userRoles.
 *  - Además se filtran sus subMenus de la misma manera.
 *
 * @param {Array} tree        // navigationConfig original
 * @param {Array} userRoles   // ej. ['admin']
 * @returns Array filtrada
 */
export function filterByAuthority(tree, userRoles) {
  return tree
    .map(node => {
      // Filtramos primero todos sus hijos:
      const filteredSub = node.subMenu?.length
        ? filterByAuthority(node.subMenu, userRoles)
        : [];

      // Comprobamos si este nodo “padre” está permitido:
      const isAllowed =
        // Si no tiene restricciones (authority vacío), siempre es visible
        node.authority.length === 0 ||
        // O si al menos uno de los roles del usuario existe en node.authority:
        node.authority.some(role => userRoles.includes(role));

      // Si NO está permitido y además no dejó submenús válidos, lo omitimos:
      if (!isAllowed && filteredSub.length === 0) {
        return null;
      }

      // Si está permitido (o aún quedan submenús para mostrar), lo devolvemos,
      // reemplazando subMenu por el filtrado:
      return {
        ...node,
        subMenu: filteredSub
      };
    })
    .filter(node => node !== null);
}
