pipeline {

    agent any

    options {
        timestamps()
        skipDefaultCheckout(true)
        skipStagesAfterUnstable()
    }

    stages {

        stage('Checkout') {
            agent {
                docker {
                    image 'alpine:3.21'
                    reuseNode true
                }
            }
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:24-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -e
                    echo "=== Node & NPM Version ==="
                    node -v
                    npm -v
                    if [ -f package-lock.json ]; then
                        npm ci --ignore-scripts
                    else
                        npm install --ignore-scripts
                    fi
                '''
            }
        }

        stage('Frontend Testing & 100% Coverage Verification') {
            agent {
                docker {
                    image 'node:24-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -e
                    echo "=== Running Vitest Unit Tests with 100% Coverage Threshold ==="
                    npm test
                '''
            }
            post {
                always {
                    archiveArtifacts(
                        artifacts: 'coverage/**/*',
                        allowEmptyArchive: true
                    )
                }
            }
        }

        stage('Build Production SPA') {
            agent {
                docker {
                    image 'node:24-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -e
                    echo "=== Building Vite React Production Assets ==="
                    npm run build
                    ls -la dist
                '''
            }
        }

        stage('Trivy Security Scan') {
            agent {
                docker {
                    image 'aquasec/trivy:0.74.0'
                    reuseNode true
                    args '''
                        --entrypoint=""
                        -e HOME=/tmp
                        -e XDG_CACHE_HOME=/tmp/.cache
                    '''
                }
            }
            steps {
                sh '''
                    set -e
                    mkdir -p .trivy-cache || true
                    trivy fs \
                        --cache-dir .trivy-cache \
                        --scanners vuln \
                        --severity HIGH,CRITICAL \
                        --skip-dirs node_modules \
                        --skip-dirs coverage \
                        --format sarif \
                        --output trivy-results.sarif \
                        --exit-code 0 \
                        .
                '''
            }
            post {
                always {
                    archiveArtifacts(
                        artifacts: 'trivy-results.sarif',
                        allowEmptyArchive: true
                    )
                }
            }
        }
    }

    post {
        success {
            echo "=========================================="
            echo "  ✅ DELCOM BLOG FRONTEND PIPELINE SUCCESS"
            echo "=========================================="
        }
        failure {
            echo "=========================================="
            echo "  ❌ DELCOM BLOG FRONTEND PIPELINE FAILED"
            echo "=========================================="
        }
    }
}
