const path = require('path')

exports.sourceNodes = ({ actions: { createTypes } }) => {
  createTypes(`
    type MoltinProduct implements Node {
      path: String!
    }
  `)
}

exports.createResolvers = ({ createResolvers }, options) => {
  const basePath = options.basePath || '/'

  createResolvers({
    MoltinProduct: {
      path: {
        resolve: source => path.join(basePath, 'products', source.slug),
      },
    },
  })
}

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const pages = await graphql(`
    {
      allProducts: allMoltinProduct {
        edges {
          node {
            id
            path
          }
        }
      }
      allCategories: allMoltinCategory {
        edges {
          node {
            id
            slug
          }
        }
      }
      allCollections: allMoltinCollection {
        edges {
          node {
            id
            slug
          }
        }
      }
      allBrands: allMoltinBrand {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `)

  pages.data.allProducts.edges.forEach(({ node: { id, path } }) => {
    createPage({
      path,
      component: require.resolve(`./src/templates/ProductPage.js`),
      context: {
        id,
      },
    })
  })

  pages.data.allCategories.edges.forEach(({ node: { id, slug } }) => {
    createPage({
      path: `/categories/${slug}`,
      component: require.resolve(`./src/templates/CategoryPage.js`),
      context: {
        id
      }
    })
  })

  pages.data.allCollections.edges.forEach(({ node: { id, slug } }) => {
    createPage({
      path: `/collections/${slug}`,
      component: require.resolve(`./src/templates/CollectionPage.js`),
      context: {
        id
      }
    })
  })

  pages.data.allBrands.edges.forEach(({ node: { id, slug } }) => {
    createPage({
      path: `/brands/${slug}`,
      component: require.resolve(`./src/templates/BrandPage.js`),
      context: {
        id
      }
    })
  })
}
