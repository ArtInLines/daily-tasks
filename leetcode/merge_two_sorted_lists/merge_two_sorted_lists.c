#include <stdio.h>
#include <stdlib.h>

// Definition for singly-linked list.
typedef struct ListNode {
    int val;
    struct ListNode *next;
} ListNode;

ListNode* makeListNode(int val) {
    ListNode* x = malloc(sizeof(ListNode) * 1);
    x->val = val;
    x->next = NULL;
    return x;
}

ListNode* mergeTwoLists(ListNode* list1, ListNode* list2){
    ListNode *head, *tmp;
    if (list1 == NULL) return list2;
    else if (list2 == NULL) return list1;
    else if (list1->val <= list2->val) {
        head = list1;
        list1 = list1->next;
    } else {
        head = list2;
        list2 = list2->next;
    }
    tmp = head;
    while (list1 != NULL && list2 != NULL) {
        if (list1->val <= list2->val) {
            tmp->next = list1;
            tmp = list1;
            list1 = list1->next;
        } else {
            tmp->next = list2;
            tmp = list2;
            list2 = list2->next;
        }
    }
    if (list1 != NULL) tmp->next = list1;
    else tmp->next = list2;
    return head;
}

int getNumFromArg(char *arg, size_t *idx)
{
    if (arg[*idx] == '-') {
        *idx += 1;
        return -getNumFromArg(arg, idx);
    }
    size_t k = 0;
    while ('0' <= arg[*idx + k] && arg[*idx + k] <= '9') k++;
    int a = 1;
    if (arg[*idx + k] == 0) a = 0;
    else arg[*idx + k] = 0;
    int res = atoi(&arg[*idx]);
    *idx += k + a;
    return res;
}

ListNode* argToList(char *arg)
{
    if (arg[0] == '*') return NULL;

    size_t idx = 0;
    ListNode* first = makeListNode(getNumFromArg(arg, &idx));
    ListNode* current = first;
    while(arg[idx])
    {
        ListNode* next = makeListNode(getNumFromArg(arg, &idx));
        current->next = next;
        current = current->next;
    }
    return first;
}

void printList(ListNode* l)
{
    if (l == NULL) printf("*");
    else {
        printf("%d", l->val);
        l = l->next;
        while (l) {
            printf(",%d", l->val);
            l = l->next;
        }
    }
}

int main(int argc, char *argv[])
{
    if (argc != 3)
    {
        printf("Incorrect number of arguments.\n");
        printf("Usage: merge list1 list2\n");
        printf("Each list should be a list of integers separated by comma.\n");
        printf("Empty lists should be marked by a single '*'\n");
        exit(1);
    }

    ListNode* l1 = argToList(argv[1]);
    ListNode* l2 = argToList(argv[2]);
    // printf("l1: "); printList(l1); printf("\n");
    // printf("l2: "); printList(l2); printf("\n");
    ListNode* l = mergeTwoLists(l1, l2);
    printList(l);
    // Leaks memory, but the OS cleans that up lol
    return 0;
}
