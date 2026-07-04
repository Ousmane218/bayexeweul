import React from 'react'
import Page500 from '@/pages/public/Page500'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erreur interceptée par ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <Page500 />
    }

    return this.props.children
  }
}
