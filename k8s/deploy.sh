#!/bin/bash
# =============================================================
# Script para desplegar Huellitas en Kubernetes
# Uso: ./deploy.sh
# Requiere: kubectl configurado apuntando al cluster correcto
# =============================================================

set -e

echo "======================================"
echo " Huellitas Veterinary - Despliegue K8s"
echo "======================================"

echo ""
echo "[1/6] Creando Namespace..."
kubectl apply -f 00-namespace.yaml

echo "[2/6] Creando Secrets (credenciales DB)..."
kubectl apply -f 01-secret.yaml

echo "[3/6] Creando Volumen persistente para MariaDB..."
kubectl apply -f 02-mariadb-pvc.yaml

echo "[4/6] Desplegando MariaDB..."
kubectl apply -f 03-mariadb-deployment.yaml

echo "      Esperando a que MariaDB este lista (puede tardar ~30s)..."
kubectl rollout status deployment/mariadb -n huellitas

echo "[5/6] Desplegando Backend Spring Boot..."
kubectl apply -f 04-backend-deployment.yaml

echo "      Esperando al Backend (puede tardar ~60s)..."
kubectl rollout status deployment/backend -n huellitas

echo "[6/6] Desplegando Frontend React..."
kubectl apply -f 05-frontend-deployment.yaml
kubectl rollout status deployment/frontend -n huellitas

echo ""
echo "======================================"
echo " DESPLIEGUE COMPLETADO"
echo "======================================"
echo ""
echo "Pods corriendo:"
kubectl get pods -n huellitas

echo ""
echo "Servicios:"
kubectl get services -n huellitas

echo ""
echo "Para ver la IP publica del frontend (AWS):"
echo "  kubectl get service frontend-service -n huellitas"
echo ""
echo "Para ver los logs del backend:"
echo "  kubectl logs -l app=backend -n huellitas"
