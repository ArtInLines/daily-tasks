#include <stdlib.h>

// Definition for singly-linked list.
struct ListNode {
    int val;
    struct ListNode *next;
};

struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2){
    struct ListNode *head, *tmp;
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