import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import { Index } from 'elasticlunr'
import 'url-search-params-polyfill'; //Temporary polyfill for EdgeHTML 14-16

import Link from '../../components/utils/temp-link'
import GlossaryTerm from '../../components/utils/glossary-term.js'

import DefaultLayout from '../../components/layouts/DefaultLayout'

const SearchResults = () => {
  const data = useStaticQuery(graphql`
    query SearchIndexQuery {
      siteSearchIndex {
        index
      }
    }
  `
  )

  const index = Index.load(data.siteSearchIndex.index)
  let urlParams = new URLSearchParams()

  if (typeof window !== 'undefined' && window) {
    urlParams = new URLSearchParams(window.location.search)
  }

  const queryString = urlParams.get('q')
  const [results, setSearchResults] = useState(index
    .search(queryString, {})
    // Map over each ID and return the full document
    .map(({ ref }) => index.documentStore.getDoc(ref))
  )

  return (
    <DefaultLayout>
      <div>
        <Helmet
          title="Search Results | Natural Resources Revenue Data"
          meta={[
            // title
            { name: 'og:title', content: 'Search Results | Natural Resources Revenue Data' },
            { name: 'twitter:title', content: 'Search Results | Natural Resources Revenue Data' },
          ]} />

        <section>
          <div className="container-page-wrapper container-margin">
            <div className="container-left-8">
              <h1 id="introduction">Search Results</h1>
            </div>
            <div className="search-results-container">
              <article className="search-results-container">
                <ul>
                  {results.length > 0 ?
                    results.map((item, index) => {
                      return <li key={ index }><Link to={ item.path }>{ item.title }</Link></li>
                    }
                    ) : <p><strong>We didn't find any results for {queryString}.</strong> You might want to try searching for <GlossaryTerm termKey={queryString}>{queryString}</GlossaryTerm> in our glossary.</p>
                  }
                </ul>
              </article>  
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  )
}

export default SearchResults
