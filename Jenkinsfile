pipeline {
    agent any

    environment {
        // Docker Hub image name
        IMAGE_NAME = "kovacsmarci46/chat-app"
        // Kubernetes kubeconfig credential ID (for later GKE deploy)
        KUBECONFIG_CRED = "kubeconfig"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                      echo "Building Docker image ${IMAGE_NAME}:${env.BUILD_NUMBER}..."
                      docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} -t ${IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'dockerhub-creds', url: '']) {
                        sh """
                          echo "Pushing Docker image to Docker Hub..."
                          docker push ${IMAGE_NAME}:${env.BUILD_NUMBER}
                          docker push ${IMAGE_NAME}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes (GKE)') {
            steps {
                script {
                    withCredentials([file(credentialsId: KUBECONFIG_CRED, variable: 'KUBECONFIG')]) {
                        withEnv(['USE_GKE_GCLOUD_AUTH_PLUGIN=True']) {
                            sh """
                              echo 'Applying base manifests...'
                              kubectl apply -f k8s/deployment.yaml
                              kubectl apply -f k8s/service.yaml
        
                              echo 'Updating deployment image to this build...'
                              kubectl set image deployment/chat-app chat-app=${IMAGE_NAME}:${env.BUILD_NUMBER} --record
        
                              echo 'Waiting for rollout to finish...'
                              kubectl rollout status deployment/chat-app
        
                              echo 'Current pods:'
                              kubectl get pods
                            """
                        }
                    }
                }
            }
}


    }

    post {
        success {
            echo "Build ${env.BUILD_NUMBER} complete. Image: ${IMAGE_NAME}:${env.BUILD_NUMBER}"
        }
        failure {
            echo "Build failed. Check logs for details."
        }
    }
}

