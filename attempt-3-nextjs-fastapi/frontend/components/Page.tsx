import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { getTests } from '../api/api'

export interface Test {
  field_1: string;
}

export const Page = () => {
  const query = useQuery('test', getTests)
  return (<>
    <h1>Test Page:</h1>
    <ul> query: {JSON.stringify(query.data)}</ul>
  </>)
}