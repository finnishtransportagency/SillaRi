#!/bin/bash

STACK=$1

if [ "$STACK" != "ui" ] && [ "$STACK" != "backend" ]; then
	echo "Usage: $0 [ui|backend]"
	exit 1
fi

CMD="aws cloudformation deploy \
--stack-name sillari-cicd-$STACK-test \
--template-file cicd-test.yaml \
--region eu-west-1 \
--profile centralized \
--capabilities CAPABILITY_NAMED_IAM \
--parameter-overrides file://params/cicd-$STACK-test.json"

echo ">> $CMD"
echo
read -n1 -rsp $'Press any key to continue or ^C to abort.\n'
echo
eval $CMD
